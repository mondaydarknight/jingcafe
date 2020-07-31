<?php

namespace JingCafe\Core\Proxy;

use JingCafe\Core\Exception\RequestException;
use JingCafe\Core\Util\Util;

/**
 * Curl wrapper
 *
 * @package curl
 * @author Mong Cheng.
 */
class Curl
{
	/**
	 * The file to read and write cookies for requests
	 * 
	 * @var string
	 */
	protected $cookieFile;

	/**
	 * Determine whether or not requests should follow redirects
	 * @var boolean
	 */
	protected $followRedirect = false;

	/**
	 * An associated array of headers to send along with requests.
	 * 
	 * @var array
	 */
	protected $headers = [];

	/**
	 * An associative array of CURLOPT options to send along with requests.
	 *
	 * @var array
	 */
	protected $options = ['CURLOPT_CONNECTTIMEOUT' => 30, 'CURLOPT_TIMEOUT' => 80];

	/** 
	 * The referer header to send along with requests.
	 * @var string
	 */ 
	protected $referer;

	/** 
	 * The  user agent to send along with requests.
	 * @var string
	 */
	protected $userAgent;

	/**
	 * Stores an error string for the last request if one occured.
	 * @var string 
	 * @access protected
	 */
	protected $error = '';

	/**
	 * Initiate the curl service;
	 * @param obejct
	 */
	protected $curl;


	/**
	 * Initialize a Curl object
	 * 
	 * @todo Set the cookieFile to curl_cookie.txt in current directory
	 * @todo Set the $_SERVER['HTTP_USER_AGENT'] if it exists, Curl\PHP . PHP_VERSION.
	 * @param array $options 	ex: ['connecttimeout' => ]
	 */
	public function __construct($options = [])
	{
		$this->options = array_merge($this->options, $options);

		// $this->cookieFile = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'curl_cookie.txt';
		$this->userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Curl/PHP' . PHP_VERSION . '(http://github.com/shuber/curl)';
		
		$this->curl = curl_init();
	}


	public function head($url, $vars = [])
	{
		return $this->request('HEAD', $url, $vars);
	}

	/**
	 * Send GET method of request
	 *	
	 * @param string 		$url
	 * @param array|string 	$vars
	 *
	 * @return CurlResponse
	 */
	public function get($url, $vars = [])
	{
		if (!empty($vars)) {
			$url .= (stripos($url, '?') !== false) ? '&' : '?';
			$url .= (is_string($vars)) ? $vars : Util::urlEncode($vars);
		}

		return $this->request('GET', $url);
	}

	/**
	 * Send POST method of request
	 * 
	 * @param string 		$url	The url of remote server address
	 * @param array 		$vars 	
	 * @return CurlResponse
	 */
	public function post($url, $vars = [])
	{
		return $this->request('POST', $url, $vars);
	}

	/**
	 *
	 *
	 */
	public function delete($url, $vars = [])
	{
		return $this->request('DELETE', $url, $vars);
	}

	/**
	 * Set the header in CURL options
	 * 
	 * @param array $header 	['Host' => 127.0.0.1, '']
	 * @return Curl
	 */
	public function setHeader($header = [])
	{
		$this->headers = array_merge($this->headers, $header);
		return $this;
	}

	/**
	 * Make an HTTP request of the specified $method to a $url withb an optional array or string of $vars
	 *
	 * Returns the CurlResponse obejct if the request was successfully, false otherwise
	 * 
	 * @param string 		$method
	 * @param string 		$url
	 * @param array 		$vars
	 * @return CurlResponse 
	 */
	protected function request($method, $url, $vars = [])
	{
		$error = '';

		if (is_array($vars)) {
			$vars = Util::urlEncode($vars);
		}

		$this->setRequestMethod($method);
		$this->setRequestOptions($url, $vars);
		$this->setRequestHeaders();

		$response = curl_exec($this->curl);

		if (!$response) {
			$error .= curl_errno($this->curl) . ' - ' . curl_error($this->curl);
			throw new RequestException($error);
		} 

		curl_close($this->curl);
		return new CurlResponse($response);
	}

	/**
	 * Formats and adds custom headers to the current request
	 * @return void
	 * @access protected
	 */
	protected function setRequestHeaders()
	{
		$headers = [];

		foreach ($this->headers as $key => $value) {
			$headers[] = $key . ': ' . $value;
		}

		curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers);
	}


	/**
	 * Set the request Method to CURL options
	 * @param string $method
	 * @access protected
	 */
	protected function setRequestMethod($method)
	{
		switch (strtoupper($method)) {
			case 'HEAD':
				curl_setopt($this->curl, CURLOPT_NOBODY, true);
				break;
			case 'GET':
				curl_setopt($this->curl, CURLOPT_HTTPGET, true);
				break;
			case 'POST':
				curl_setopt($this->curl, CURLOPT_POST, true);
				break;
			default:
				curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, $method);
				break;
		}
	}

	/**
	 * Set the CURLOPT options for the current request
	 *  
	 * @param string $url 
	 * @param string $vars 
	 * @return void
	 * @access protected
	 */
	protected function setRequestOptions($url, $vars)
	{
		$options = $this->options;
		curl_setopt($this->curl, CURLOPT_URL, $url);

		if (!empty($vars)) {
			curl_setopt($this->curl, CURLOPT_POSTFIELDS, $vars);
		}

		# Set some default CURL options
		curl_setopt($this->curl, CURLOPT_HEADER, true);
		curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->curl, CURLOPT_USERAGENT, $this->userAgent);

		if ($this->cookieFile) {
			curl_setopt($this->curl, CURLOPT_COOKIEFILE, $this->cookieFile);
			curl_setopt($this->curl, CURLOPT_COOKIEJAR, $this->cookieFile);
		}

		if ($this->followRedirect) {
			curl_setopt($this->curl, CURLOPT_FOLLOWLOCATION, true);
		}

		if ($this->referer) {
			curl_setopt($this->curl, CURLOPT_REFERER, $this->referer);
		}

		# Set the custom CURL options
		foreach ($options as $option => $value) {
			curl_setopt($this->curl, constant('CURLOPT_' . str_replace('CURLOPT_', '', strtoupper($option))), $value);	
		}
		
	}
	


}	



