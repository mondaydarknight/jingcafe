<?php

/** 
 * Client Controller
 *
 * @author Mong cheng
 */
namespace JingCafe\Client\Controller;

use ArrayObject;
use Exception;
use InvalidArgumentException;
use UnexpectedValueException;
use Carbon\Carbon;

use Illuminate\Database\Capsule\Manager as Capsule;
use JingCafe\Core\Controller\Controller;
use JingCafe\Core\Database\Models\Product;
use JingCafe\Core\Database\Models\Order;
use JingCafe\Core\Database\Models\User;
use JingCafe\Core\Exception\AuthExpiredException;
use JingCafe\Core\Exception\AccountNotVerifiedException;
use JingCafe\Core\Exception\AccountInvalidException;
use JingCafe\Core\Exception\InvalidCredentialsException;
use JingCafe\Core\Exception\NotFoundException;
use JingCafe\Core\Exception\SpammyRequestException;
use JingCafe\Core\Mail\EmailRecipient;
use JingCafe\Core\Mail\HtmlMailMessage;
use JingCafe\Core\Notification\NotificationManager;
use JingCafe\Core\Util\Util;
use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Util\OpenSSLCryptography;
use JingCafe\Core\Util\Password;
use JingCafe\Core\Util\MacAddressCryptography;
use JingCafe\Core\Util\ModelProcessor;
use JingCafe\Core\Util\ServerSideValidator;
use JingCafe\Core\Util\Validator;
use JingCafe\Core\Schema\RequestSchema;
use JingCafe\Core\Schema\RequestTransformer;



class ClientController extends Controller
{	


	/**
	 * Process an new account request. (HTTP: POST)
	 *
	 * This is throttled to prevent account enumeration, since it nneds to divulge when a email has been used.
	 * Process the request from the form on the registration page, checking that:
	 * !. The honeypot was not modified. 
	 * 2. Account registration is enabled.
	 * 3. The user is not already logged in.
	 * 4. Valid information information was entered.
	 * @deprecated 5. The captcha, if enabled is correct. 
	 * 6. The username and email are not already taken.
	 * Request type: POST
	 * @return User Object for the user record that wass created.
	 */
	public function register($request, $response, $args)
	{
		$params = $request->getParsedBody();

		/**
		 * Check the honeypot. "spiderSpam" is not a real field. 
		 * It's hidden on the main page and must be submitted with its default value for this to be processed.
		 */
		if (!isset($params['spiderSpam']) || $params['spiderSpam'] !== 'http://') {
			throw new SpammyRequestException('Possible spam received: ' . print_r($params));
		}

		$classMapper = $this->container->classMapper;
		$config = $this->container->config;

		if (!$config['site.registration.enabled']) {
			// Disable registration
			return $response->withStatus(403);
		}
		
		// Register authenticator service of container
		if ($this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(403);
		}

		// Load the request schema
		$schema = new RequestSchema($this->container->locator->findResource('schema://register.yaml', true));
		
		// Whitelist and set parameters defaults
		$userData = $data = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));

		// Encrypt columns 
		$schemaFiles = $schema->all();

		foreach ($schemaFiles as $fieldName => $field) {
			if (isset($field['encrypted']) && isset($userData[$fieldName])) {
				$userData[$fieldName] = CBMCryptography::encrypt($userData[$fieldName]);
			}
		}

		// Throttle requests

	
		// Check if username exist.		
		if ($classMapper->staticMethod('user', 'findUnique', 'account', $userData['account'])) {
			return $response->withJson(['exception' => [['message' => 'ACCOUNT.EXIST|account']]], 400);
		}

		// Check captcha if requuired


		// Hash password
		$userData['password'] = Password::hash($userData['password']);

		$user = Capsule::transaction(function() use ($classMapper, $userData, $config) {
			// Create user
			$user = $classMapper->createInstance('user', $userData);
			$user->save();

			$this->sendUserAccountVerifiedMail($config, $user);
			return $user;
		});

		return $response->withJson(OpenSSLCryptography::encrypt($user->id, $config['verification.key']), 200);
	}


	/**
	 * User login (HTTP: POST)
	 *
	 * Process the request from the form on the login page
	 * 1. The user is not already loggedin
	 * 2. The rate limit for type of request is being observed.
	 * 3. The user account exists.
	 * 4. The user account is enabled and verified, if there's failed from authentication
	 * 5. The user enter a valid username|email and password
	 * @throws InvalidArgumentException 	500 	VERIFY_VALIDATE
	 * @throws AccountInvalidException		403
	 * @throws AccountNotVerifiedException	403	
	 * @throws AuthCompromisedException 	403	
	 * @throws AuthExpiredException 		403
	 * @throws InvalidCredentialsException	403
	 * @return [string]
	 */
	public function login($request, $response, $args)
	{		
		$authenticator = $this->container->authenticator;

		$params = $request->getParsedBody();
		$classMapper = $this->container->classMapper;
		$config = $this->container->config;
		$schema = new RequestSchema($this->container->locator->findResource('schema://login.yaml'));
		
		$data = RequestTransformer::transform($schema, $params);
		$userParams = ServerSideValidator::loadSchema($schema)->validate($data);
		
		$userParams['account'] = CBMCryptography::encrypt($userParams['account']);

		// Authenticate
		try {
			$user = $authenticator->authenticate($userParams, true);
		} catch(Exception $e) {
			if ($e instanceof AccountNotVerifiedException) {				
				$stdClass = json_decode($e->getMessage());
				$user = $this->container->classMapper->createInstance('user', [
					'account'	=> $stdClass->account,					
					'username' 	=> $stdClass->username
				]);

				$user->id = $stdClass->id;
				
				$this->sendUserAccountVerifiedMail($config, $user);
			}

			return $response->withJson(['exception' => $e->getUserMessages()], $e->getHttpErrorCode());
		}
		
		return $response->withJson($this->decryptUserInfo($user), 200);
	}


	/**
	 * User logout (HTTP: GET)
	 *
	 * Clear PHP session and cookie info, removing the persistent session across all browsers/devices
	 * 
	 * @todo There are occuring a bug for refreshing website, leading to validating failure. So we send refresh CSRF token to client side.
	 */
	public function logout($request, $response, $args)
	{
		$this->container->authenticator->requestLogout();
		// $response->withHeader('Location', $this->container->config['site.uri.public'])
		// $uri = $request->getUri()->withPath($this->container->get('router')->pathFor('index'));
		// return $response->withStatus(302)->withHeader('Location', $this->container->config['site.uri.public']);
		return $response->withJson(['csrf' => $this->fetchAndRefreshCsrfToken()], 200);
	}

	/**
	 * Process an new email verification request. (HTTP: GET)
	 * Verify the token for specific user
	 *
	 * 1. The token provided matches a user the database.
	 * 2. The user account is not already verified.
	 */
	public function verifyAccount($request, $response, $args)
	{
		$view = $this->container->view;
		$locator = $this->container->locator;
		$params = $request->getQueryParams();
		
		try {
			if (!isset($params['token'])) {
				throw new UnexpectedValueException('Undefined or missing variable token, please check request.');
			}

			$token = trim($params['token']);
			$accountVerification = $this->container->accountVerification;

			if (!$accountVerification->complete($token)) {
				throw new AccountInvalidException();
			}

			$accountVerification->removeExpired();
		} catch(Exception $e) {
			// $this->container->router->pathFor();
			return $response->withRedirect('/error');
		}

		return $response->withRedirect('/#!/?isOpenLoginModal=true');
	}

	/**
	 * Resend email token to user for verificaiton (HTTP: POST)
	 *
	 * @todo Check the session have the user_id and match authenticated key of params
	 */
	public function resendAccountVerifiedMail($request, $response, $args)
	{
		$params = $request->getParsedBody();
		
		if (!isset($params['userId'])) {
			throw new InvalidArgumentException('Undefined request parameter: verifyKey.');
		}

		$config = $this->container->config;
		$classMapper = $this->container->classMapper;		
		
		$userId = (int) OpenSSLCryptography::decrypt($params['userId'], $config['verification.key']);
		
		$user = $classMapper->staticMethod('user', 'where', 'id', $userId)
			->where('flag_enabled', true)
			->where('flag_verified', false)
			->first();

		if (!$user) {
			throw new AccountInvalidException("Access rejection: Invalid user id or disabled user.");
		}

		$this->sendUserAccountVerifiedMail($config, $user);

		return $response->withStatus(200);
	}






	/**
	 * Determine whether the user is exist.(HTTP: GET)
	 * 
	 * Compare user's salt key from session or cookie with persistent database 
	 *
	 * @return user|null
	 */
	public function isLoggedIn($request, $response, $args)
	{
		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(403);
		}
		
		return $response->withJson($this->decryptUserInfo($user), 200);
	}


	/**
	 * Get user orders from database.
	 *
	 * @todo matche the order and fetch orders 
	 * @return array[mixed] 	array
	 */
	public function getOrders($request, $response, $args)
	{
		$params = $request->getQueryParams();

		if (!isset($params['type']) || empty($params['type'])) {
			return $response->withStatus(404);
		}

		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		$type = trim($params['type']);
		$classMapper = $this->container->classMapper;

		$orders = $classMapper->staticMethod('order', 'getOrdersByType', $type, $user);

		foreach ($orders as $order) {
			
			if (!$order->userLogistic || !$order->userPayment) {
				throw new NotFoundException('Undefined userLogistic or userPayment.');
			}

			ModelProcessor::process($order, ['decodeProducts']);
			$order->userLogistic = ModelProcessor::process($order->userLogistic, ['decryptUserLogistic'])->toArray();
			$order->userPayment = ModelProcessor::process($order->userPayment, ['decryptUserPayment'])->toArray();
		}

		return $response->withJson($orders, 200);
	}



	/**
	 * Get the reasons of order that canceled
	 */
	public function getOrderCancelReasons($request, $response, $args)
	{
		$classMapper = $this->container->classMapper;
		return $response->withJson($classMapper->staticMethod('cancelReasons', 'all'), 200);
	}





	/**
	 * Get information fo user checkout activity, including logistics and payment, etc...
	 *
	 */
	public function getUserCheckoutInfo($request, $response, $args)
	{
		$classMapper = $this->container->classMapper;
		
		$this->container->authenticator->getCurrentOnlineUser();

		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		$logistics = $classMapper->staticMethod('logistic', 'all');
		$payments = $classMapper->staticMethod('payment', 'all');

		$userLogistic = $classMapper->staticMethod('userLogistic', 'where', ['user_id' => $user->id])->first();
		$userPayment = $classMapper->staticMethod('userPayment', 'where', ['user_id' => $user->id])->first();

		ModelProcessor::process($userLogistic, ['decryptUserLogistic']);
		ModelProcessor::process($userPayment, ['decryptUserPayment' => true]);
		
		return $response->withJson([
			'logistics' 	=> $logistics, 
			'payments' 		=> $payments, 
			'userLogistic' 	=> $userLogistic, 
			'userPayment' 	=> $userPayment
		], 200);
	}



	/**
	 * Checkout user order (HTTP: POST)
	 * Store user order storage and send notification email 
	 * 
	 * 1. Transform and verify params data
	 *
	 */
	public function checkout($request, $response, $args)
	{		
		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}
		
		$classMapper = $this->container->classMapper;
		$config = $this->container->config;
		$locator = $this->container->locator;		
		$params = $request->getParsedBody();	

		$schema = new RequestSchema($locator->findResource('schema://checkout.yaml'));		
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));
		
		foreach ($params['products'] as $key => $product) {
			$params['products'][$key] = ModelProcessor::filterProductColumns($product);
		}

		Capsule::transaction(function() use ($classMapper, $config, $params, $user) {
			// Update the amount of the prodct
			foreach ($params['products'] as $product) {
				$productModel = $classMapper->staticMethod('product', 'findOrFail', $product['id']);
				$productModel->amount = (int)$product['amount'] - (int)$product['quantity'];
				$productModel->purchase_times++;
				$productModel->save();
			}
					
			// Create or update the logistic of the user.
			$userLogistic = $classMapper->staticMethod('userLogistic', 'updateOrCreate', [
				'user_id' 		=> $user->id,
				'logistic_id' 	=> $params['logistic']['id']
			], [
				'username'		=> CBMCryptography::encrypt($params['logistic']['username']),
				'phone'			=> CBMCryptography::encrypt($params['logistic']['phone']),
				'address' 		=> OpenSSLCryptography::encrypt($params['logistic']['address'])
			]);
			
			// Create or update the payments of the user.
			$userPayment = $classMapper->staticMethod('userPayment', 'updateOrCreate', [
				'user_id' 		=> $user->id,
				'payment_id'	=> $params['payment']['id']
			]);
			
			$continueDay = isset($config['system.checkout.continue_day']) ? $config['system.checkout.continue_day'] : 3;

			$orderParams = [
				'products'			=> Util::toJson($params['products']),
				'logistic_fee'		=> isset($params['logistic']['fee']) ? $params['logistic']['fee'] : 0,
				'total_price'		=> $params['totalPrice'],
				'message'			=> isset($params['message']) ? $params['message'] : '',
				'user_id'			=> $user->id,
				'user_logistic_id' 	=> $userLogistic->id,
				'user_payment_id' 	=> $userPayment->id,
				'expired_at'		=> Carbon::now()->addDays($continueDay)
			];
			
			$order = $classMapper->createInstance('order', $orderParams);
			$order->save();

			$adminPayment = $classMapper->staticMethod('userPayment', 'select', ['username', 'account', 'card_number', 'payment_id'])
				->with('payment')
				->where('level', 'A')
				->first();

			if (!$adminPayment) {
				throw new NotFoundException('Admin payment object not found.');
			}

			ModelProcessor::process($adminPayment, ['decryptUserLogistic', 'decryptUserPayment' => true]);

			$user->account = CBMCryptography::decrypt($user->account);
			$user->username = CBMCryptography::decrypt($user->username);

			// Set the unauthorized payment into cache
			$cache = $this->container->cache;

			$unpaidPaymentVerification = [
				'paymentId' => $userPayment->id,
				'orderId'	=> $order->id,
				'secretKey'	=> Util::generateGuidKey()
			];

			$cache->tags('client')->put("unpaidPaymentVerification{$user->id}|{$order->id}", $unpaidPaymentVerification, $continueDay * 24 * 60);

			$unpaidPaymentVerification['secretId'] = OpenSSLCryptography::encrypt($order->id.'.'.$userPayment->id);
			
			$message = new HtmlMailMessage($this->container->view, 'mail/checkout.html.twig');
			
			$message
				->from($config['mail.admin'])
				->addEmailRecipient(new EmailRecipient($user->account, $user->username))
				->addParams([
					'mail' => [
						'title' => '訂購成功'
					],
					'user'			=> $user,
					'adminPayment'	=> $adminPayment,					
					'logistic' 		=> $params['logistic'],
					'payment'		=> $params['payment'],
					'products'		=> $params['products'],
					'totalPrice' 	=> $params['totalPrice'],
					'verification' 	=> $unpaidPaymentVerification,
					'expiredAt'		=> $orderParams['expired_at']
				]);

			$this->container->mailer->send($message);
		});

		return $response->withStatus(200);
	}

	/**
	 * Cancel the user order (HTTP: PUT)
	 */
	public function cancelUserOrder($request, $response, $args)
	{
		$locator = $this->container->locator;
		$params = $request->getParsedBody();

		$schema = new RequestSchema($locator->findResource('schema://cancel-order.yaml'));
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));

		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		$classMapper = $this->container->classMapper;		
		$orderId = [$params['orderId']];
		$columns = ['cancel_reason_id' => $params['reasonId']];
		
		$classMapper->staticMethod('order', 'alter', 'canceled', $orderId, $columns);
		return $response->withStatus(200);
	}


	public function sendForgetPasswordEmail($request, $response, $args)
	{
		$params = $request->getParsedBody();
		$schema = new RequestSchema($this->container->locator->findResource('schema://forget-password.yaml'));
	
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));

		// Find the user email has been existed
		$classMapper = $this->container->classMapper;

		$user = $classMapper->staticMethod('user', 'where', 'account', CBMCryptography::encrypt($params['account']))->first();

		if (!$user) {
			throw new NotFoundException('ACCOUNT.NOT_EXIST');
		}

		$user->account = $params['account'];
		$user->username = CBMCryptography::decrypt($user->username);

		$config = $this->container->config;
		$session = $this->container->session;

		$secretKey =  Util::generateRandomKey(50);
		$session->set('secretKey', MacAddressCryptography::encrypt($secretKey, $config['verification.key']))
			->set('userId', MacAddressCryptography::encrypt($user->id, $config['verification.key']))
			->set('expiredAt', time() + 3600);

		// Send verify email
		$message = new HtmlMailMessage($this->container->view, 'mail/reset-password.html.twig');
		$message
			->from($config['mail.admin'])
			->addEmailRecipient(new EmailRecipient($user->account, $user->username))
			->addParams([
				'mail' => [
					'title' => '重新設定帳戶'
				],
				'user'		=> $user,
				'secretKey' => $secretKey
			]);	

		$this->container->mailer->send($message);
		
		return $response->withStatus(200);
	}

	/**
	 * Reset the password of the user
	 * First we need to check the input parameters data is dangerous.
	 * then find the columns of SESSION of server is existed 
	 * determine the current time is small than session['expiredAt'] 
	 *
	 * @todo If the user account was not verified, when they verify reset-password we'll give accessibility to the user.
	 * @return response with HTTP code 204 (No content)
	 */
	public function resetPassword($request, $response, $args)
	{
		$params = $request->getParsedBody();
		$schema = new RequestSchema($this->container->locator->findResource('schema://reset-password.yaml'));

		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));

		$config = $this->container->config;
		$session = $this->container->session;
		
		if (!$session->has('userId') || !$session->has('secretKey') || !$session->has('expiredAt')) {
			throw new NotFoundException('Server storage key not found.');
		} 

		if (time() > (int)$session->get('expiredAt')) {
			$exception = new AuthExpiredException();
			return $response->withJson(['exception' => $exception->getUserMessages()], $exception->getHttpErrorCode());
		}

		$secretKey = MacAddressCryptography::decrypt($session->get('secretKey'), $config['verification.key']);

		if ($secretKey !== $params['secretKey']) {
			throw new InvalidArgumentException('Invalid secret key.');
		}

		$classMapper = $this->container->classMapper;

		$user = $classMapper->staticMethod('user', 'findOrFail', $params['userId']);
		
		if ($user->rank !== 'C') {
			throw new UnexpectedValueException('The user authority error.');
		}
		
		$user->password = Password::hash($params['password']);
		$user->flag_verified = true;
		$user->flag_enabled = true;
		$user->save();

		$session->remove('userId')->remove('secretKey')->remove('expiredAt');

		return $response->withStatus(204);
	}


	/**
	 * Settle payment of user
	 *
	 * Verify the current user and check the time is not expired
	 * and determine whether match the data from Radis / Database is correct 
	 * 
	 * 
	 */
	public function settlePayment($request, $response, $args)
	{
		$params = $request->getParsedBody();

		$schema = new RequestSchema($this->container->locator->findResource('schema://settle-payment.yaml'));

		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));

		// [orderId, paymetnid]
		$secretId = array_map(function($id) {
			return (int) $id;
		}, explode('.', OpenSSLCryptography::decrypt($params['secretId'])));
	
		$config = $this->container->config;
		$cache = $this->container->cache;

		$verificationKey = "unpaidPaymentVerification{$user->id}|{$secretId[0]}";

		if (!$cache->tags('client')->has($verificationKey)) {
			throw new NotFoundException("Unknown unpaid payment verification of user.");
		}

		$verification = $cache->tags('client')->get($verificationKey);

		if ($verification['orderId'] !== $secretId[0] || $verification['paymentId'] !== $secretId[1] || $verification['secretKey'] !== $params['secretKey']) {
			throw new InvalidArgumentException('Invalid payment id or secret key in process.');
		}

		// Remove the verification record from cache
		$cache->tags('client')->forget($verificationKey);
		
		$classMapper = $this->container->classMapper;
		// Set paid to true from order table
		$order = $classMapper->staticMethod('order', 'findOrFail', $verification['orderId']);
		$order->paid = true;
		$order->save();

		$userPayment = $classMapper->staticMethod('userPayment', 'findOrFail', $verification['paymentId']);
		$userPayment->username = CBMCryptography::encrypt($params['username']);
		$userPayment->account = OpenSSLCryptography::encrypt($params['account']);
		$userPayment->save();
		
		// broadcast in notification
		$continueMinutes = (isset($config['system.notification.continue_day']) ? $config['system.notification.continue_day'] : 3) * 24 * 60;
		$notifications = $cache->tags('admin')->get('notification') ?: [];

		array_unshift($notifications, [
			'icon' => 'iconCoin',
			'title' => '匯款通知',
			'context' => "{$params['username']}完成匯款 查看訂單編號{$verification['orderId']}",
			'dateTime' => Carbon::now()->format('m-d H:i')
		]);

		$cache->tags('admin')->put('notification', $notifications, $continueMinutes);
		
		return $response->withStatus(200);
	}


	/**
	 * Update the user information
	 * HTTP (PUT)
	 *
	 */
	public function updateUserInfo($request, $response, $args)
	{
		$params = $request->getParsedBody();

		$schema = new RequestSchema($this->container->locator->findResource('schema://register.yaml'));
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));
		
		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		$user->username = CBMCryptography::encrypt($params['username']);
		$user->phone = CBMCryptography::encrypt($params['phone']);
		$user->save();

		return $response->withStatus(200);
	}	



	/**
	 * Fetch basic information from online user
	 *
	 * @return array [username, account, phone] 
	 */
	protected function decryptUserInfo(User $user)
	{
		return [
			'username'	=> CBMCryptography::decrypt($user->username),
			'email'		=> CBMCryptography::decrypt($user->account),
			'phone'		=> CBMCryptography::decrypt($user->phone)			
		];
	}


	/**
	 * Send email to user for verify usage
	 * 
	 * @param array $config
	 * @param User 	$user
	 * @return void
	 */
	protected function sendUserAccountVerifiedMail($config, User $user)
	{
		$accountVerificationModel = $this->container->accountVerification->create($user, $config['verification.timeout']);

		$mailMessage = new HtmlMailMessage($this->container->view, 'mail/verify-account.html.twig');

		// Decrypt the username 
		$user->account = CBMCryptography::decrypt($user->account);
		$user->username = CBMCryptography::decrypt($user->username);

		$mailMessage->from($config['mail.admin'])
			->addEmailRecipient(new EmailRecipient($user->account, $user->username))
			->addParams([
				'mail' 	=> ['title' => '會員認證'],
				'user'	=> $user,
				'token'	=> $accountVerificationModel->getToken()
			]);

		return $this->container->mailer->send($mailMessage);
	}
	

	protected function fetchAndRefreshCsrfToken()
	{
		$config = $this->container->config;
		$session = $this->container->session;
		$csrf = $this->container->csrf;

		$csrf->generateToken();

		if (!$session->has($config['session.keys.csrf'])) {
			$session[$config['session.keys.csrf']] = new ArrayObject;
		}

		$session[$config['session.keys.csrf']] = [$csrf->getTokenName() => $csrf->getTokenValue()];

		return [
			'csrf-name-key' 	=> $csrf->getTokenNameKey(),
			'csrf-name'			=> $csrf->getTokenName(),
			'csrf-value-key' 	=> $csrf->getTokenValueKey(),
			'csrf-value'		=> $csrf->getTokenValue()
		];
	}

}


















