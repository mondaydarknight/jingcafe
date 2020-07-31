<?php

namespace JingCafe\Core\Cache;

use InvalidArgumentException;
use Illuminate\Cache\CacheManager;
use Illuminate\Container\Container;

class ArrayStore 
{
	/**
	 * Used to create dummy Illuminate Container
	 * @var app
	 */
	protected $app;

	/**
	 * @var mixed
	 */
	protected $config;

	/**
	 * 
	 * @var string
	 */
	protected $repository;


	/**
	 * Create the empty Illuminate Container and required config
	 *
	 * @access public 
	 * @param string 	$storeName (default: "default")
	 * @param mixed 	$app
	 * @param void 		
	 */
	public function __construct($storeName = "default", $app = null)
	{
		$this->storeName = $storeName;
		$this->config = new Repository;
		
		if (!is_string($storeName) || $storeName == "") {
			throw new InvalidArgumentException("Store name is not a valid string.");
		}

		$this->app = ($app instanceof Container) ? $app : new Container;

		// Set up the array store
		$this->config['cache.stores'] = [
			$storeName => [
				'driver' => 'array'
			]
		];
	}

	/**
	 * Return the store instance from the Laravel CacheManager
	 *
	 * @access public
	 * @return Laravel Cache instance
	 */
	public function instance() 
	{
		$config = $this->config;

		$this->app->singleton('config', function() use ($config) {
			return $config;
		});

		$cacheManager = new CacheManager($this->app);
		return $cacheManager->store($this->storeName);
	}
}



