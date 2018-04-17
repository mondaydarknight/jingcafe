<?php



namespace JingCafe\Core\Session;

use ArrayAccess;
use Illuminate\Session\ExistenceAwareInterface;
use Illuminate\Support\Arr;
use SessionHandlerInterface;

/**
 * A wrapper for $_SESSION that can be used with a variety of different session handlers.
 * Based on Illuminate\Session.
 *
 * @author Mong
 */
class Session implements ArrayAccess 
{

	/**
	 * The session handler implementation.
	 *
	 * @var \SessionHandlerInterface
	 */
	protected $handler;

	/**
	 * Create the session wrapper
	 *
	 * @param SessionHandlerInterfacee	$handler
	 * @param array 					$config
	 */	
	public function __construct(SessionHandlerInterface $handler = null, array $config = [])
	{
		$this->handler = $handler;
	
		if (session_status() === PHP_SESSION_NONE) {
			if ($handler) {
				session_set_save_handler($handler, true);
			}

			if (isset($config['cache_limiter'])) {
				session_cache_limiter($config['cache_limiter']);
			}

			if (isset($config['cache_expire'])) {
				session_cache_expire($config['cache_expire']);
			}

			if (isset($config['name'])) {
				session_name($config['name']);
			}
		}

	}

	/**
	 * Start session 
	 */
	public function start()
	{
		if (session_status() === PHP_SESSION_NONE) {
			session_start();
		}
	}


	public function destroy($destroyCookie = true) 
	{
		session_unset();

		/**
		 * If it's desired to kill the session, also delete the session cookie.
		 * @todo This will destroy the session, and not just the session data.
		 */
		if ($destroyCookie && ini_get('session.use_cookie')) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params['path'],
				$params['domain'],
				$params['secure'],
				$params['httponly']
			);
		}

		session_destroy();
	}

	/**
 	 * Regenerate Session ID. 
 	 * Prevent Session fixation attack
 	 * @param bool $deleteOldSession. Set to true when you are logging 
 	 */
	public function regenerateId($deleteOldSession = false) 
	{
		session_regenerate_id($deleteOldSession);
		$this->setExists(false);
	}

	/**
	 * Determine if the given session value exists.
	 *
	 * @param string 	$key 
	 * @return mixed
	 */
	public function has($key) 
	{
		return Arr::has($_SESSION, $key);
	}

	/**
	 * Get specified SESSION value
	 * 
	 * @param string 	$key
	 * @param mixed 	$default
	 * @return mixed
	 */
	public function get($key, $default = null) 
	{
		return Arr::get($_SESSION, $key, $default);
	}

	/**
	 * Set Session Value
	 *
	 * @param array|string 	$key
	 * @param mixed 		$value
	 * @return void
	 */
	public function set($key, $value) 
	{
		if (is_array($key)) {
			foreach ($key as $innerKey => $innerValue) {
				Arr::set($_SESSION, $innerKey, $innerValue);
			}
		} else {
			Arr::set($_SESSION, $key, $value);
		}
	}

	/**
	 * Set the existence of the session on the handler if applicable
	 *
	 * @param bool 	$value
	 * @return void
	 */
	public function setExists() 
	{
		if ($this->handler instanceof ExistenceAwareInterface) {
			$this->handler->setExists($value);
		}
	}

	/**
	 * Prepend a value into an array.
	 *
	 * @param string 	$key
	 * @param mixed 	$value
	 * @return void
	 */
	public function prepend($key, $value) 
	{
		$array = $this->get($key);
		
		array_unshift($array, $value);
		
		$this->set($key, $array);
	}

	/**
	 * Push a value onto an array session
	 *
	 * @param string 	$key
	 * @param mixed 	$value
	 * @return void
	 */
	public function push($key, $value) 
	{
		$array = $this->get($key);

		array_push($array, $value);

		$this->set($key, $array);
	}

	/**
	 * Get all of the session items for the application
	 *
	 * @return array
	 */
	public function all()
	{
		return $_SESSION;
	}

	/**
	 * Determine if the given session options exists
	 *
	 * @param string 	$key
	 * @return bool
	 */
	public function offsetExists($key) 
	{	
		return $this->has($key);
	}

	/**
	 * Get a session option
	 *
	 * @param string 	$key
	 * @return mixed
	 */
	public function offsetGet($key)
	{
		return $this->get($key);
	}	

	/**
	 * Set a session value
	 * @param array | string 	$key
	 * @param mixed 			$value
	 * @return mixed
	 */
	public function offsetSet($key, $value) 
	{
		$this->set($key, $value);
	}

	/**
	 * Unset a session option
	 *
	 * @param string 	$key
	 * @return void
	 */
	public function offsetUnset($key) 
	{
		$this->set($key, null);
	}

}
