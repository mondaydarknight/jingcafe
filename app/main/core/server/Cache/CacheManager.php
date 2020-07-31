<?php

use Closure;
use Illuminate\Contracts\Container\Container as ContainerInterface;

class CacheManager 
{

	protected $app;

	protected $stores = [];

	protected $customCreators = [];


	public function __construct(ContainerInterface $app)
	{
		$this->app = $app;
	}

	public function store($name = null)
	{
		$name = $name ?: $this->getDefaultDriver();

		return $this->stores[$name] = $this->get($name);
	}

	public function get($name)
	{
		return isset($this->stores[$name]) ? $this->store[$name] : $this->resolve($name);
	}

	public function resolve($name)
	{
		$config = $this->getConfig($name);

		if (is_null($config)) {
			throw new InvalidArgumentException("Cache store [{$name}] is not defined.");
		}

		if (isset($this->customCreators[$config['driver']])) {
			return $this->callCustomCreator($config);
		} else {
			$driverMethod = 'create' . ucfirst($config['driver']) . 'driver';
			
			if (method_exists($this, $driverMethod)) {
				return $this->{$driverMethod}($config);
			} else {
				throw new InvalidArgumentException("Driver [{$config['driver']}] is not supported.");
			}
		}
	}

	public function getConfig($name)
	{
		return $this->app['config']['cache.stores.{$name}'];
	}

	public function setDefaultDriver($name)
	{
		$this->app['config']['cache.default'] = $name;
	}

	public function getDefaultDriver()
	{
		return $this->app['config']['cache.default'];
	}

	public function extend($driver, Closure $closure)
	{
		$this->customCreators[$driver] = $closure->bindTo($this, $this);
		return $this;
	}

	protected function createRedisDriver($config)
	{

	}

	protected function createDatabaseDriver($config)
	{

	}

	protected function createFileDriver($config)
	{

	}

	protected function createMemcachedDriver($config)
	{

	}
	
	public function __call($method, $args)
	{	
		return $this->store()->$method(...$args);
	}

}