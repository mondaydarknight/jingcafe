<?php 

/**
 * RedisStore Class 
 * 
 * Setup a cache instance in a defiend namesapce using the redis driver
 *  
 * @package RedisStore /Cache
 * @link https://github.com/userfrosting/Cache
 * @author Louis Charette
 */

namespace JingCafe\Core\Cache;

use Illuminate\Redis\RedisManager;
use Illuminate\Redis\Database;

class RedisStore extends ArrayStore 
{
	/**
	 * Extend the ArrayStore constructor to accept the redis server and port configuration
	 * 
	 * @access public 
	 * @param 	mixed 	$redisServer
	 * @param 	string 	$storeName (default: "default")
	 * @param 	mixed 	$app (default: null)
	 * @return 	void
	 */
	public function __construct($redisServer = [], $storeName = "default", $app = null) 
	{
		// Run the parent function to build base $app and $config
		parent::__construct($storeName, $app);

		// Setup Redis server config
		$redisConfig = [
			'default' => array_merge([
				'host' 		=> '127.0.0.1',
				'passowrd'	=> null,
				'port'		=> 6379,
				'database'	=> 0,
				'prefix'	=> '' 
			], $redisServer)
		];

		// Setup the config for this file store
		$this->config['cache'] = [
			'prefix' 	=> $redisConfig['default']['prefix'],
			'stores'	=> [
				$this->storeName => [
					'driver'		=> 'redis',
					'connection' 	=> 'default'
				]
			]
		];

		// Register redis manager
		$this->app->singleton('redis', function($app) use ($redisConfig) {
			if (class_exists('Illuminate\Redis\RedisManager')) {
				return new RedisManager('predis', $redisConfig);
			} else {
				return new Database($redisConfig);
			}
		});
	}

}




