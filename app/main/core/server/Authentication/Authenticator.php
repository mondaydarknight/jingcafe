<?php




namespace JingCafe\Core\Authentication;

use Birke\Rememberme\Authenticator as PersistentAuthenticator;
use Birke\Rememberme\Storage\PDOStorage as PersistentStorage;
use Birke\Rememberme\Triplet as PersistentTriplet;
use Illuminate\Database\Capsule\Manager as Capsule;
use Interop\Container\ContainerInterface;
use JingCafe\Core\Exception\AccountInvalidException;
use JingCafe\Core\Exception\AccountNotVerifiedException;
use JingCafe\Core\Exception\AuthCompromisedException;
use JingCafe\Core\Exception\AuthExpiredException;
use JingCafe\Core\Exception\InvalidCredentialsException;
use JingCafe\Core\Session\Session;
use JingCafe\Core\Database\Models\User;
use JingCafe\Core\Util\ClassMapper;
use JingCafe\Core\Util\Password;
use JingCafe\Core\Util\Validator;


/**
 * Handles authentication tasks.
 *
 * @author Mong cheng
 *
 *
 */
class Authenticator extends PersistentAuthenticator
{
	/**
	 *
	 * @var Authenticator instance
	 */
	private static $authenticatorInstance;

	/**
	 * The rank of administrator token
	 * @var string
	 */ 
	protected $administratorToken = 'A';

	/**
	 * @var ClassMapper
	 */
	protected $classMapper;

	/**
	 * @var Container config
	 */
	protected $config;

	/**
	 * @var Cache
	 */
	protected $cache;

	/**
	 * @var Session
	 */
	protected $session;

	/**
	 * @var PersistentStorage
	 */
	protected$persistentStorage;

	/**
	 * @var User
	 */
	protected $user;

	/**
	 * Indicates if the user was authenticated via rememberMe cookie.
	 * @var bool
	 */
	protected $viaRemember = false;


	public function __construct()
	{

	}

	public static function create(ClassMapper $classMapper, Session $session, $config, $cache = null)
	{
		if (!isset(static::$authenticatorInstance)) {
			static::$authenticatorInstance = new static();
		}

		static::$authenticatorInstance->classMapper = $classMapper;
		static::$authenticatorInstance->session = $session;
		static::$authenticatorInstance->config = $config;
		static::$authenticatorInstance->cache = $cache;
		static::$authenticatorInstance->buildRememberConnection()->setupCookieConfiguration();
		return static::$authenticatorInstance;
	}

	/**
	 * Attempts to authenticate a user based on a supplied identity and passowrd
	 *
	 * @param array 	$userParams
	 * @param bool 		$isRememberMe
	 * @param bool 		$isAdmin
	 * @return User 	
	 */
	public function authenticate($userParams = [], $isRememberMe = false, $isAdmin = false)
	{
		$userColumns = $isAdmin ? ['account' => $userParams['account'], 'rank' => $this->administratorToken] : ['account' => $userParams['account']];
		
		$user = $this->classMapper->staticMethod('user', 'where', $userColumns)->first();
		
		if (!$user) {
			throw new InvalidCredentialsException();
		}
		
		if (!$user->password) {
			throw new InvalidCredentialsException();
		}

		if (!Validator::validateBoolean($user->flag_enabled)) {
			throw new AccountDisabledException();
		}

		if (!Validator::validateBoolean($user->flag_verified)) {
			throw new AccountNotVerifiedException($user);
		}

		if (!Password::verify($userParams['password'], $user->password)) {
			throw new InvalidCredentialsException();
		}

		$this->requestLogin($user, $isRememberMe);
		return $user;
	}

	/**
	 * Process an account login request.
	 *
	 * This method log in the specified user, allowing the client to assume the user's identity for the duration of the session.
	 *
	 * @param User 	$user 			The user to log in.
	 * @param bool 	$isRememberMe	Set to true to make this a persistent session, i.e. one that will re-login even after the session expires.
	 * @todo Figure out a way to update the currentUser service to reflect the logged-in user *immediately* in the service provider.
	 * At it stands, the currentUser service will still reflect a "guest user" for the remainder of the request.
	 */
	public function requestLogin($user, $isRememberMe = false)
	{
		// $this->clearUserSessionFromCache();
		$this->session->regenerateId(true);

		$isRememberMe ? $this->createCookie($user->id) : $this->clearCookie();

		$key = $this->config['session.keys.current_user_id'];
		$this->session[$key] = $user->id;
		$this->viaRemember = false;
	}

	/**
	 * Process an account log out.
	 *
	 * Logs the currently authenticated user out, destroying the PHP session and clearing the persistent session.
	 *
	 * This can optionally remove presistent sessions across all browsers / devices, since there are be RememberMe cookie and corresponding database entries in multiple browsers devices 
	 * @link http://jaspan.com/improved_persistent_login_cookie_best_practice.
	 * @param bool 	If set to true, ensure that user is logged out from all browsers and all devices.
	 */
	public function requestLogout($isDeleteAllPersistent = false)
	{		
		$currentUserId = $this->session->get($this->config['session.keys.current_user_id']);

		if ($isDeleteAllPersistent) {
			$this->persistenceStorage->cleanAllTriplets($currentUserId);
		}

		$this->clearCookie();

		if ($currentUserId) {
			$currentUser = $this->classMapper->staticMethod('user', 'find', $currentUserId)->get();
			// if ($currentUser) {
			// 	$currentUser->onLogout();	
			// }			
		}

		$this->user = null;

		// $this->clearUserSessionFromCache();
		
		$this->session->destroy();

		$this->session->start();
	}


	/**
	 * Get current authenticated user, returning a guest user if none was found.
	 *
	 * Tries to re-establish a session for "remember_me" users who have been logged out due to an expired session.
	 * @return object|null
	 * @throws AuthExpiredException
	 * @throws AuthCompromisedException 
	 * @throws AccountInvalidException
	 * @throws AccountDisabledException
	 */
	public function getCurrentOnlineUser()
	{
		if ($this->user) {
			return $this->user; 
		}

		try {
			if (!$this->validateUserFromSession()) {
				$this->validateUserFromCookie();
			}

		} catch (\PDOException $e) {
			$this->user = null;
		}

		return $this->user;
	}

	/**
	 * Determine whether the current user was authenticated using remember cookie
	 * @todo This functino is useful when users are performing sensitve operations, you may want to force them to re-authenticate.
	 * @return bool
	 */
	public function isViaRemember()
	{
		return $this->viaRemember;
	}

	/**
	 * Initialize the persistenceStorage connection and trigger parent constructor.
	 */
	protected function buildRememberConnection()
	{
		$config = $this->config;
		$this->persistentStorage = new PersistentStorage($config['persistence.table']);

		$pdo = Capsule::connection()->getPdo();

		$this->persistentStorage->setConnection($pdo);

		parent::__construct($this->persistentStorage);
		
		return $this;
	}

	/**
	 * Setup cookie configuration by config
	 * 
	 */
	protected function setupCookieConfiguration()
	{	
		$config = $this->config;
		$cookieName = $config['session.name'] . '-' . $config['persistence.cookie.name'];

		$this->getCookie()->setName($cookieName);
		$this->getCookie()->setPath($config['persistence.cookie.path']);

		if ($config->has('persistence.cookie.expire_time')) {
			$this->getCookie()->setExpireTime($config['persistence.cookie.expire_time']);
		}
	}


	/**
	 * Since regenerateId deletes the old session, we'll do same in the cache.
	 */
	protected function clearUserSessionFromCache()
	{
		$this->cache->tags([$this->config['cache.prefix'], '_s' . session_id()])->flush();		
	}

	/**
	 * Attempt to login the client from the session
	 *
	 * @return int|null 				userId
	 * @throws AuthExpiredException 	The client attempt to use an expired rememberMe token
	 *
	 */
	protected function validateUserFromSession()
	{
		$userId = $this->session->get($this->config['session.keys.current_user_id']);
		
		if (!$userId) {
			return null;
		}

		$this->validateUserAccount($userId);

		if (!$this->validateRememberMeCookie()) {
			$this->requestLogout();
			throw new AuthExpiredException();
		}

		return $userId;
	}


	/**
	 * Attempt to login the client from their rememberMe token 
	 *
	 * @return User|bool 					If true the User object, false otherwise
	 * @throws AuthCompromisedException 	The Client attempt to login with invalid token.
	 */	
	protected function validateUserFromCookie()
	{
		$loginResult = $this->login();

		if ($loginResult->isSuccess()) {
			// Update in session
			$this->session[$this->config['session.keys.current_user_id']] = $loginResult->getCredential();
			// There is a chance that an hacker has stolen the login token.
			// We store the fact the user was logged in viaRememberMe (instead of login form)
			$this->viaRemember = true;
			
			return $this->validateUserAccount($loginResult->getCredential());
		}
		
		// If $rememberMe->login() was not successful, check the token was invalid as well 
		// This means cookie was stolen
		if ($loginResult->hasPossibleManipulation()) {
			throw new AuthCompromisedException();
		}	
	}

	/**
	 * Determine if the cookie contains a valid persistence token
	 *	@return bool
	 */ 
	protected function validateRememberMeCookie()
	{
		$cookieValue = $this->getCookie()->getValue();

		if (!$cookieValue) {
			return false;
		}

		$triplet = PersistentTriplet::fromString($cookieValue);

		if (!$triplet->isValid()) {
			return false;
		}

		return true;
	}

	/**
	 * Load specified user by id from the database.
	 *
	 * Check that account is valid and enabled, thorwing an exception
	 * @param int 		$userId
	 * @param User|null
	 * @throws AccountInvalidException
	 * @throws AccountDisabledException
	 */
	protected function validateUserAccount($userId)
	{
		$user = $this->classMapper->staticMethod('user', 'find', $userId);
		if (!$user) {
			throw new AccountInvalidException();
		}

		// If the user has been disabled since their last request, throw exception.
		if (!$user->flag_enabled) {
			throw new AccountDisabledException();
		}

		return $this->user = $user;
	}


}






