<?php

namespace JingCafe\Core\Util;


abstract class Manager
{
	/**
	 * @var App
	 */
	protected $app;

	/**
	 * array
	 */
	protected $drivers = [];

	protected $customDrivers = [];

	abstract public function getDefaultDriver(); 

	/**
	 * Construtor
	 */
	public function __construct($app)
	{
		$this->app = $app;
	}

	public function driver($name = null)
	{
		$driver = $name ?: $this->getDefaultDriver($name);
	
		if (isset($this->drivers[$driver])) {
			$this->drivers[$driver] = $this->createDriver($driver);
		}

		return $this->drivers[$driver];
	}

	public function createDriver($driver)
	{
		if (isset($this->customDrivers[$driver])) {
			return $this->callCustomDriver();
		}
	}

	protected function callCustomDriver($driver)
	{
		return $this->customDrivers[$driver]($this->app);
	}

	public function createCustomDriver($driver)
	{
		return $this->customDrivers[$driver]}($this->app);
	}


	public function extend($name, Closure $callback)
	{
		$this->customDrivers[$name] = $callback;
	}
	
	public function drivers()
	{
		return $this->drivers;
	}

	public function __call($method, $parameters)
	{
		return $this->driver()->{$method}(...$parameters);
	}

}