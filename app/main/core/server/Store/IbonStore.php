<?php

namespace JingCafe\Core\Store;

use InvalidArgumentException;
use UnexpectedValueException;

class IbonStore extends Store
{	
	/**
	 * @var array
	 */
	protected $patterns = [
		'county' => [
			'methods' => ['getZone', 'getRoad', 'getStore'],
			'url' 	=> 'byAreaData.aspx'
		],
		'name' => [
			'methods'=> ['getName'],
			'url'	=> 'byNameData.aspx'
		],
		'id' => [
			'methods' => ['getId'],
			'url'	=> 'byIDData.aspx'
		]
	];

	/**
	 * Get zone and road by county
	 * 
	 * @param array $pattern
	 * @return array
	 */
	public function getZone($pattern = [])
	{
		$this->configureRequestUrl($pattern['url']);

		$vars = [
			'mode'	=> 'city',
			'city'	=> isset($this->config['county']) ? $this->config['county'] : ''
		];

		return ['zone' => $this->request($vars)];
	}

	/**
	 * Get zone and road by county
	 * 
	 * @param array $pattern
	 * @return array
	 */
	public function getRoad($pattern = [])
	{
		$this->configureRequestUrl($pattern['url']);

		$vars = [
			'mode'	=> 'road',
			'city'	=> isset($this->config['county']) ? $this->config['county'] : '',
			'zone' 	=> isset($this->config['zone']) ? $this->config['zone'] : ''
		];

		return ['road' => $this->request($vars)];
	}

	/**
	 * Get stores by area
	 *
	 * @param array $pattern
	 *
	 * @return array
	 */
	public function getStore($pattern = [])
	{
		$this->configureRequestUrl($pattern['url']);
	
		$vars = [
			'mode'	=> 'store',
			'city' 	=> isset($this->config['county']) ? $this->config['county'] : '', 
			'zone' 	=> isset($this->config['zone']) ? $this->config['zone'] : '',
			'road' 	=> isset($this->config['road']) ? $this->config['road'] : '',
			'eshopparid' => '',
			'eshopid'	=> '',
			'route2'	=> '' 
		];

		return $this->request($vars);
	}

	/**
	 * Get stores by area
	 *
	 * @param array $pattern
	 *
	 * @return array
	 */
	public function getName($pattern = [])
	{
		$this->configureRequestUrl($pattern['url']);
	
		return $this->request($vars);
	}

	/**
	 * Get stores by area
	 *
	 * @param array $pattern
	 *
	 * @return array
	 */
	public function getId($pattern = [])
	{
		$this->configureRequestUrl($pattern['url']);
	
		return $this->request($vars);
	}

	/**
	 * Combine the config url and pattern url
	 * 
	 * @param string $url
	 *
	 * @return void
	 */
	protected function configureRequestUrl($url)
	{
		if (empty($this->config['url'])) {
			throw new InvalidArgumentException("Undefined fetch url.");
		}
		
		$this->url = $this->config['url'] . $url;
	}

	/**
	 * Set the headers in configuration fo CURL
	 *
	 * @todo This is very important step to make remote server identify request.
	 * ['Referer' => URL], otherwise will get rejection from server.
	 *
	 * @return Store
	 */
	protected function setRefererHeader()
	{
		$this->curl->setHeader([
			'Accept' 			=> '*/*',
			'Origin' 			=> 'https://emap.pcsc.com.tw',
			'Accept-Language' 	=> 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
			'Content-Type' 		=> 'application/x-www-form-urlencoded;',
			'Referer'			=> $this->config['url']
		]);

		return $this;
	}

	/**
	 * Request to remote server by CURL
	 *
	 * @param array $parameters
	 * @param array $vars
	 *
	 * @return array
	 */
	protected function request(array $vars = [])
	{		
		$this->initCurl(true)->setRefererHeader();
		$parameters = array_replace(['zone' => '', 'cate' => 3], $vars);


		return $this->parseResponse($this->curl->post($this->url, $parameters));
	}

	/**
	 * Parse the response from curl request
	 * 
	 * @param CurlResponse;
	 * @return array
	 */
	protected function parseResponse($response) 
	{		
		$response = explode(';', $response);

		if ($response[0] !== 'OK') {
			throw new UnexpectedValueException("INVALID.COUNTY_NOT_FOUND");
		}

		// Remove the firsy key ([0] => OK) value from array
		array_splice($response, 0, 1);

		return $response;
	}

}



