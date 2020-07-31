<?php

namespace JingCafe\Core\Proxy;

use JingCafe\Core\Exception\RequestException;
use JingCafe\Core\Util\Util;

class CurlConnector
{
	/**
	 * The default options of CURL settings.
	 * @var array|function
	 */ 
	protected $defaultOptions = [];

	/**
	 * @var 
	 */
	protected $userAgentInfo;

	/** 
	 * 
	 * @var CurlConnector
	 */
	private static $instance;

	/**
	 *
	 * @var int
	 */
	private $timeout = 80;

	/**
	 *
	 * @var int
	 */
	private $connectTimeout = 30;



	public static function create($defaultOptions = [])
	{
		if (!static::$instance) {
			static::$instance = new static($defaultOptions);
		}

		return static::$instance;
	}

	public function __construct($defaultOptions = [])
	{
		$this->defaultOptions = $defaultOptions;
		$this->initUserAgentInfo();
	}


	public function request($method, $absUrl, $params = [], $headers = [], $hasFile = false)
	{
		$curl = curl_init();
		$options = $this->defaultOptions;

		if (is_callable($options)) {
			$options = call_user_func_array($this->defaultOptions, func_get_args());
			throw new RequestException($this->defaultOptions);
		}

		switch (strtoupper($method)) {
			case 'GET':
				if ($hasFile) {
					throw new RequestException('Issuing a GET request with a file parameter');
				}

				$options[CURLOPT_HTTPGET] = 1;
				if (count($params) > 0) {
					$encoded = Util::urlEncode($params);
					$absUrl = "$absUrl?$encoded";
				}
				break;
			
			case 'POST':
				$options[CURLOPT_POST] = 1;
				$options[CURLOPT_POSTFIELDS] = $hasFile ? $params : Util::urlEncode($params);  
				break;

			case 'DELETE':
				$options[CURLOPT_CUSTOMREQUEST] = 'DELETE';

				if (count($params) > 0) {
					$encoded = Util::urldecode($params);
					$absUrl = "$absUrl?$encoded";
				}
				break;
			default:
				throw new RequestException("Unrecognized method $method");
				break;
		}

		$responseHeaders = [];
		$headerCallback = function($curl, $headerLine) use($responseHeaders) {
			if (strpos($headerLine, ':') === false) {
				return strlen($headerLine);
			}

			list($key, $value) = explode(':', trim($headerLine), 2);
			$responseHeaders[trim($key)] = trim($value);
			return strlen($headerLine);
		};

		array_push($headers, 'Expect: ');

		$absUrl = Util::utf8($absUrl);
		$options[CURLOPT_URL] = $absUrl;
		$options[CURLOPT_RETURNTRANSFER] = true;
		$options[CURLOPT_CONNECTTIMEOUT] = $this->connectTimeout;
		$options[CURLOPT_TIMEOUT] = $this->timeout;
		$options[CURLOPT_HEADERFUNCTION] = $headerCallback;
		$options[CURLOPT_HEADER] = $headers;

		curl_setopt_array($curl, $options);
		$response = curl_exec($curl);

		// if (!defined('CURLE_SSL_CACERT_BADFILE')) {
		// 	define('CURL_SSL_CACERT_BADFILE', 77);	
		// }

		$errno = curl_errno($curl);

		if ($errno === CURLE_SSL_CACERT || $errno === CURLE_SSL_PEER_CERTIFICATE) {
			array_push($headers, 'X-JingCafe-Client-Info: {"ca": "using JingCafe CA bundle"}');
			curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
			$response = curl_exec($curl);
		}

		if (!$response) {
			$errno = curl_errno($curl);
			$message = curl_error($curl);
			curl_close($curl);
			$this->handleCurlError($absUrl, $errno, $message);
		}	

		$responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		return [$response, $responseCode, $responseHeaders];
 	}

	public function setTimeout($seconds)
	{
		$this->timeout = (int) max($seconds, 0);
		return $this;
	}

	public function setConnectTimeout($seconds)
	{
		$this->connectTimeout = (int) max($seconds, 0);
		return $this;
	}

	public function getTimeout()
	{
		return $this->timeout;
	}

	public function getConnectTimeout()
	{
		return $this->connectTimeout;
	}

	public function getDefaultOptions()
	{
		return $this->defaultOptions;
	}


	public function getUserAgentInfo()
	{
		return $this->userAgentInfo;
	}

	protected function initUserAgentInfo()
	{
		$curlVersion = curl_version();

		$this->userAgentInfo = [
			'httplib' 	=> 'curl' . $curlVersion['version'],
			'ssllib' 	=> $curlVersion['ssl_version']
		];
	}


	private function handleCurlError($url, $errno, $message)
	{
		switch ($errno) {
			case CURLE_COULDNT_CONNECT:
			case CURLE_COULDNT_RESOLVE_HOST:
			case CURLE_OPERATION_TIMEOUTED:
				$msg = "Could not connect to Stripe ($url).  Please check your "
                 . "internet connection and try again.  If this problem persists, "
                 . "you should check Stripe's service status at "
                 . "https://twitter.com/stripestatus, or";
				break;
			case CURLE_SSL_CACERT:
			case CURLE_SSL_PEER_CERTIFICATE:
				$msg = "Could not verify Stripe's SSL certificate.  Please make sure "
                 . "that your network is not intercepting certificates.  "
                 . "(Try going to $url in your browser.)  "
                 . "If this problem persists,";
			default:
				 $msg = "Unexpected error communicating with Stripe.  "
                 . "If this problem persists,";
				break;
		}

		$msg .= ' let us know';

		$msg .= "\n\n (Network error [errno $errno]: $message)";
		throw new RequestException($msg);
	}

}

