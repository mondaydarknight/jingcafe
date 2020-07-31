<?php

namespace JingCafe\Core\Store\Traits;

use InvalidArgumentException;
use JingCafe\Core\Proxy\Curl;

trait HasCurlService
{
	/**
	 * @var Curl
	 */
	protected $curl;

	/**
	 * Register curl service
	 *
	 * @param bool $shouldDisableVerified
	 */
	protected function initCurl($shouldDisableVerified = false)
	{	
		$curlOptions = [];

		if ($shouldDisableVerified) {
			$curlOptions = [
				'CURLOPT_CAINFO' => \JingCafe\APP_DIR . '/cacert.pem'
				// 'CURLOPT_RETURNTRANSFER' 	=> TRUE,
				// 'CURLOPT_SSL_VERIFYPEER'	=> FALSE
			];
		}

		$this->curl = new Curl($curlOptions);
		return $this;
	}

	/**
	 * Request the curl service
	 * 
	 * @param string $method 
	 * @param string $url
	 * @param array  $parameters 
	 *
	 * @return CurlResponse
	 */
	protected function execute($method, $url, array $parameters = [])
	{
		if (!method_exists($this->curl, strtolower($method))) {
			throw new InvalidArgumentException("Invalid request method in curl.");
		}

		return $this->curl->{$method}($url, $parameters);
	}

}