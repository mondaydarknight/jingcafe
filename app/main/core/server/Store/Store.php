<?php

namespace JingCafe\Core\Store;

use UnexpectedValueException;
use JingCafe\Core\Store\Traits\HasCurlService;

abstract class Store
{
	use HasCurlService;

	/**
	 * @var array 
	 */
	protected $config;

	/**
	 * @var string
	 */
	protected $url;

	/**
	 * Consturctor
	 *
	 * @param array $config
	 */
	public function __construct(array $config)
	{
		$this->config = $config;
	}

	public function getCurl()
	{
		return $this->curl;
	}

	/**
	 * Get the stores
	 *
	 * @param string|null 	$name
	 * @param array 		$methods
	 *
	 * @return array
	 */
	public function get($name = null, $methods = [])
	{
		if (!isset($this->patterns[$name])) {
			throw new InvalidArgumentException("Undefiend method of fetching stores.");
		}

		$pattern = $this->patterns[$name];

		if (!is_array($pattern['methods'])) {
			throw new UnexpectedValueException("The data type of property must be array in patterns.");
		}

		if (!empty($methods)) {
			return $this->requestMany($pattern, $methods);
		}

		return $this->{$pattern['methods'][0]}($pattern);
	}

	/**
	 * Send many request in process
	 * 
	 * @param array $methods
	 * @param array $pattern
	 *
	 * @param array
	 */
	public function requestMany(array $pattern, array $methods)
	{	
		$result = [];

		foreach ($methods as $method) {
			$method = 'get' . ucfirst($method);

			if (in_array($method, $pattern['methods'])) {
				$result = array_replace($result, $this->{$method}($pattern));
			}
		}

		return $result;
	}

}





