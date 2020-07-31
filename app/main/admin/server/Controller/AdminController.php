<?php

namespace JingCafe\Admin\Controller;

use Exception;
use InvalidArgumentException;
use JingCafe\Core\Controller\Controller;
use JingCafe\Core\Database\Models\Product;
use JingCafe\Core\Database\Models\Order;
use JingCafe\Core\Database\Models\User;
use JingCafe\Core\Exception\NotFoundException;
use JingCafe\Core\File\YamlFileLoader;
use JingCafe\Core\Schema\RequestSchema;
use JingCafe\Core\Schema\RequestTransformer;
use JingCafe\Core\Util\Util;
use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Util\ModelProcessor;
use JingCafe\Core\Util\Password;
use JingCafe\Core\Util\ServerSideValidator;
use JingCafe\Core\Util\Validator;

use JingCafe\Admin\Controller\Traits\AdminManager;

class AdminController extends Controller
{

	use AdminManager;

	/**
	 * Render admin page
	 * @todo Please set the html or twig file in templates folder of admin, streamBuilder will collect whole file and render.
	 */
	public function pageIndex($request, $response, $args)
	{
		return $this->container->view->render($response, 'index.admin.html.twig');
	}


	/**
	 * Administrator login (HTTP: POST)
	 * 
	 * @return null (HTTP_STATUS: 200)
	 */
	public function login($request, $response, $args) 
	{
		$authenticator = $this->container->authenticator;
		
		// if ($user = $authenticator->getCurrentOnlineUser()) {
		// 	$user = User::encryptOrDecryptUser($user, false);
		// 	return $response->withJson($this->fetchUserBasicInformation($user), 200);
		// }

		$params = $request->getParsedBody();


		$schema = new RequestSchema($this->container->locator->findResource('schema://login.yaml'));
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));
		$params = User::encryptOrDecryptUser($params, true);
	
		try {
			$user = $authenticator->authenticate($params, true, true);
		} catch(Exception $e) {
			return $response->withJson(['exception' => $e->getUserMessages()], $e->getHttpErrorCode());
		}
		
		$user = User::encryptOrDecryptUser($user, false);

		return $response->withJson($this->fetchUserBasicInformation($user), 200);
	}


	/**
	 * Administrator logout (HTTP: GET)
	 *
	 * @return null (HTTP_STATUS: 302)
	 */
	public function logout($request, $response, $args)
	{
		$this->container->authenticator->requestLogout();
		return $response->withHeader('Location', $this->container->config['site.uri.public'])->withStatus(302);
	}

	/**
	 * Determine the user is logged in (HTTP: GET)
	 *
	 * @throws Exception ERROR 401
	 * @return array[]	
	 */
	public function isLoggedIn($request, $response, $args)
	{
		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		if (!$user->isAdmin()) {
			return $response->withStatus(401);
		}

		$user = User::encryptOrDecryptUser($user, false);
		return $response->withJson($this->fetchUserBasicInformation($user) ,200);
	}


	public function updateShopInfo($request, $response, $args)
	{
		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);		
		}

		$params = $request->getParsedBody();
		$params['freeLogisticPrice'] = Validator::validateinteger($params['freeLogisticPrice']);

		$shopPath = $this->container->locator->findResource('schema://shop.yaml');

		$fileLoader = new YamlFileLoader;		
		$shopFile = $fileLoader->addPath($shopPath)->load();

		foreach ($shopFile as $key => $value) {
			if (isset($params[$key]) && !empty($params[$key])) {
				$shopFile[$key] = $params[$key];
			}
		}

		$fileLoader->saveFile($shopPath, $shopFile);

		return $response->withStatus(200);
	}

	/**
	 * Get all products from shop owner id (HTTP: GET)
	 *
	 */
	public function getAllProducts($request, $response, $args)
	{
		$products = Product::select(['id', 'name', 'en_name', 'amount', 'product_key', 'price', 'discount', 'profile', 'characteristic', 'description', 'last_category_id', 'flag_enabled', 'updated_at'])->with('category')->orderBy('id', 'desc')->get();
		
		if ($products) {
			$config = $this->container->config; 
			$relativeProductFilePath = $config['path.assets.product'];

			foreach ($products as $key => $product) {
				$product->profile = $relativeProductFilePath . $product->profile;
				$products[$key] = Util::convertArrayKeyToCamelCase($product->toArray());
			}
		}

		return $response->withJson($products, 200);
	}

	/**
	 * Upload products (HTTP: POST)
	 *
	 * Find parameters have product id modify product 
	 * 
	 *
	 * @throws FileException
	 */
	public function uploadProduct($request, $response, $args) 
	{
		$params = $request->getParsedBody();
		$locator = $this->container->locator;

		$schema = new RequestSchema($locator->findResource('schema://product-upload.yaml', true));
		$params = RequestTransformer::transform($schema, $params);
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));

		if (isset($_FILES['files'])) {
			$config = $this->container->config;
			$fileUploader = $this->container->fileUploader;
			
			$absoluteProductFilePath = $config['path.document_root'] . $config['path.assets.product'];

			# FileException handle process
			$fileResult = $fileUploader->setUploadDirectory($absoluteProductFilePath)->upload();
	
			$params['profile'] = $fileResult['files'][0]['name'];
		}

		if (!isset($params['productKey']) || empty($params['productKey'])) {
			$params['productKey'] = Util::generateRandomKey(10);
		} 

		$params = array_merge($params, [
			'name'				=> $params['name'],
			'en_name' 			=> isset($params['enName']) ? $params['enName'] : '',
			'characteristic' 	=> isset($params['characteristic']) ? $params['characteristic'] : '',
			'flag_enabled'		=> $params['flagEnabled'],
			'product_key'		=> $params['productKey'],
			'last_category_id'	=> $params['categoryId'],
			'shop_id'			=> 1
		]);

		unset($params['enName']);
		unset($params['productKey']);
		unset($params['categoryId']);
		unset($params['flagEnabled']);
		
		$classMapper = $this->container->classMapper;

		if (isset($params['id'])) {
			$product = $classMapper->staticMethod('product', 'findOrFail', $params['id']);
		} else {
			$product = $classMapper->createInstance('product');			
		}
		
		$product->fill($params)->save();
		// $product->fill([
		// 	'name' 				=> CBMCryptography::encrypt($params['name']),
		// 	'en_name'			=> $params['enName'],
		// 	'price'				=> $params['price'],
		// 	'product_key'		=> $params['productKey'],
		// 	'profile'			=> $fileResult['files'][0]['name'],
		// 	'characteristic'	=> CBMCryptography::encrypt($params['characteristic']),
		// 	'description'		=> $params['description'],
		// 	'last_category_id'	=> $params['categoryId'],
		// 	'shop_id'			=> 1
		// ])->save();
		return $response->withStatus(200);		
	}

	/**
	 *
	 *
	 *
	 */
	public function removeproduct($request, $response, $args)
	{
		// if (!isset($args['productId'])) {
		// 	throw neW InvalidArgumentException('Undefiend parameters column productId.');
		// }

		$params = $request->getParsedBody();

		if (!isset($params['productId']) || empty($params['productId'])) {
			throw new InvalidArgumentException('Undefined or empty variable of productId.');
		}

		$productId = Validator::validateinteger(trim($params['productId']));
		
		if (!$user = $this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}

		$classMapper = $this->container->classMapper;
		$classMapper->staticMethod('product', 'findOrFail', $productId)->delete();

		return $response->withStatus(200);
	}


	/**
	 * Fetch notifications from cache
	 * @return array
	 */
	public function getAdminNotifications($request, $response, $args)
	{
		$cache = $this->container->cache;
		return $response->withJson($cache->tags('admin')->get('notification'), 200);
	}


	/** 
	 * Get the composition setting of order (HTTP: GET)
	 *
	 */
	public function getOrderComposition($request, $response, $args)
	{
		return $response->withJson(Order::getComposition(), 200);
	}


	/**
	 * Get orders by datetimes (HTTP: GET)
	 * 
	 */	
	public function getOrdersByDatetime($request, $response, $args) 
	{
		$params = $request->getQueryParams();

		if (!isset($params['dateTimeType']) || empty($params['dateTimeType'])) {
			throw new NotFoundException('Undefined parameters type of date time. Check your request parameters and send again');
		}
 		
 		$classMapper = $this->container->classMapper;
 		$orders = $classMapper->staticMethod('order', 'getAllOrdersByDateTime', $params['dateTimeType'], $params);

 		foreach ($orders as $key => $order) {
 			if (!$order->userLogistic || !$order->userPayment) {
 				throw new NotFoundException('Undefined logistic or payment of user.');
 			}

 			ModelProcessor::process($order, ['decodeProducts']);
 			$order->userLogistic = ModelProcessor::process($order->userLogistic, ['decryptUserLogistic'])->toArray();
 			$order->userPayment = ModelProcessor::process($order->userPayment, ['decryptUserPayment'])->toArray();
 		}

 		return $response->withJson($orders, 200);
	}


	public function getAllClients($request, $response, $args)
	{

		if (!$this->container->authenticator->getCurrentOnlineUser()) {
			return $response->withStatus(401);
		}


		$clients = User::select(['id', 'account', 'username', 'phone', 'sex', 'rank'])->where(['rank' => 'C', 'flag_enabled' => true])->get();

		foreach ($clients as $client) {
			$client->account = CBMCryptography::decrypt($client->account);
			$client->username = CBMCryptography::decrypt($client->username);
			$client->phone = CBMCryptography::decrypt($client->phone);
		}
	
		return $response->withJson($clients, 200);
	}


	/**
	 * Get orders by user (Http: GET)
	 *
	 * @return array
	 */
	public function getOrdersByUser($request, $response, $args)
	{
		$params = $request->getQueryParams();

		if (!isset($params['userType']) || empty($params['userType'])) {
			throw new InvalidArgumentException('Undefined or empty of userType column.');
		}

		if (!isset($params['input']) || !is_string($params['input'])) {
			throw neW InvalidArgumentException('Undefined or empty of input column.');
		}
		$classMapper = $this->container->classMapper;
		$orders = Order::getAllOrdersByUser(trim($params['userType']), trim($params['input']));
		
		foreach ($orders as $key => $order) {
			if (!$order->userLogistic || !$order->userPayment) {
 				throw new NotFoundException('Undefined logistic or payment of user.');
 			}

 			ModelProcessor::process($order, ['decodeProducts']);
 			$order->userLogistic = ModelProcessor::process($order->userLogistic, ['decryptUserLogistic'])->toArray();
 			$order->userPayment = ModelProcessor::process($order->userPayment, ['decryptUserPayment'])->toArray();
		}

		return $response->withJson($orders, 200);
	}


	/**
	 * Alter orders status (HTTP: PUT)
	 * Including of changing the status of orders, ex: if the order is unpaid, change to produced or canceled order;
	 * if the roder is produced, then change it to completed order
	 *
	 * @todo Verify the request from online administrator
	 */
	public function alterOrders($request, $response, $args)
	{
		$params = $request->getParsedBody();
		
		$locator = $this->container->locator;
		$schema = new RequestSchema($locator->findResource('schema://alter-order.yaml'));
		
		$params = ServerSideValidator::loadSchema($schema)->validate(RequestTransformer::transform($schema, $params));
		
		if (empty($params['orderIndexes'])) {
			throw new InvalidArgumentException('Empty array elements in orderIndexes column.');
		}
		
		Order::alter($params['type'], $params['orderIndexes']);
		
		return $response->withStatus(200);
	}


	public function removeNotification($request, $response, $args)
	{
		$params = $request->getParsedBody();
		
		if (!isset($params['notificationIndex'])) {
			throw new InvalidArgumentException('Undefined index of notification.');
		}

		$cache = $this->container->cache;

		$notifications = $cache->tags('admin')->get('notification');
		
		array_splice($notifications, (int)$params['notificationIndex'], 1);

		$continueMinutes = $this->container->config['system.notification.continue_day'] * 24 * 60;
		$cache->tags('admin')->put('notification', $notifications, $continueMinutes);

		return $response->withStatus(200);
	}


}



