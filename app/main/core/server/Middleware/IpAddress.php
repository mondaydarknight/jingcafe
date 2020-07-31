<?php

namespace JingCafe\Core\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

/**
 * The middleware invoke to detect the user source
 *
 *
 * @author Mong Cheng
 */
class IpAddress
{
	/**
	 * Enable checking the proxy headers (X-Forwarded-For to determined client IP.)
	 * Defaults to false as only $_['REMOTE_ADDR'] is a trustworthy source of IP address
	 * 
	 * @var bool
	 */
	protected $checkProxyHeaders;

	/**
	 * List of trusted proxy IP Address
	 * 
	 * If not empty, one of these IP addresses must be in $_SERVER['REMOTE_ADDR']
	 * in order for the proxy headers to be loaded at
	 *
	 * @var array
	 */ 
	protected $trustedProxies;


	/**
	 * Name of the attribute added to ServerRequest object
	 * 
	 * @var string
	 */
	protected $attributeName = 'ip_address';

	/**
	 * List proxy headers inspected for client IP Address
	 * 
	 * @var array
	 */
	protected $headersToInspect = [
		'Forwarded',
		'X-Forwarded-For',
		'X-Forwarded',
		'X-Cluster-Client-Ip',
		'Client-Ip'
	];


	/** 
	 * Constructor
	 *
	 * @param bool 		$checkProxyHeaders 	whether to use proxy headers to determine the client IP
	 * @param array 	$trustedProxies 	List of IP addresses of trusted proxies		
	 * @param string 	$attributeName		Name of attribute added to ServerRequest object
	 * @param array 	$headersToInspect	List of headers to inspect
	 */
	public function __construct(
		$checkProxyHeaders = false,
		$trustedProxies = [],
		$attributeName = null,
		$headersToInspect = [])
	{
		$this->checkProxyHeaders = $checkProxyHeaders;
		$this->trustedProxies = $trustedProxies;

		if ($attributeName) {
			$this->attributeName = $attributeName;
		}

		if (!empty($headersToInspect)) {
			$this->headersToInspect = $headersToInspect;
		}
	}

	/**
	 * Set the attributeName to the client's IP address as determined from the proxy header (X-Forwarded-For or from $_SERVER[REMOTE_ADDR])
	 *
	 * @param ServerRequestInterface $request 	PSR7 request
	 * @param ResponseInterface $response 		PSR7 response
	 * @param callable $next(array)				Next middleware
	 * 
	 * @return ResponseInterface
	 */
	public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
	{
		if (!$next) {
			return $response;
		}

		$ipAddress = $this->determineClientIpAddress($request);
		$request = $request->withAttribute($this->attributeName, $ipAddress);

		return $response = $next($request, $response);		
	}


	/**
	 * Get the IP address of user
	 *
	 * @return string
	 */
	protected function determineClientIpAddress($request)
	{
		$ipAddress = null;
		$serverParams = $request->getServerParams();

		if (isset($serverParams['REMOTE_ADDR']) && $this->isValidateIpAddress($serverParams['REMOTE_ADDR'])) {
			$ipAddress = $serverParams['REMOTE_ADDR'];
		}

		$checkProxyHeaders = $this->checkProxyHeaders;

		if ($checkProxyHeaders && $this->trustedProxies) {
			if (!in_array($ipAddress, $this->trustedProxies)) {
				$checkProxyHeaders = false;
			}
		}

		if ($checkProxyHeaders) {
			foreach ($this->headersToInspect as $header) {
				if ($request->hasHeader($header)) {
					$ip = $this->getFirstIpAddressFromHeader($request, $header);
					if ($this->isValidateIpAddress($ip)) {
						$ipAddress = $ip;
						break;
					}
				}
			}
		}

		return $ipAddress;
	}

	/**
	 * Check given string is a vaild IP address
	 *
	 * @param string ip
	 * @return bool
	 */
	protected function isValidateIpAddress($ip)
	{
		$flags = FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6;
		
		return filter_var($ip, FILTER_VALIDATE_IP, $flags);
	}

	/**
	 * Find out the client's IP address from headers available to us
	 *
	 * @param ServerRequestInterface $request PSR-7 Request
	 * @param string $header Header name
	 * @return string
	 */
	private function getFirstIpAddressFromHeader($request, $header)
	{
		$items = explode(',', $request->getHeaderLine($header));
		$headerValue = trim(reset($items));

		if (ucfirst($header) === 'Forwarded') {
			foreach (explode(';', $headerValue) as $headerPart) {
				if (strtolower(substr($headerPart, 0, 4)) == 'for=') {
					$for = explode(']', $headerPart);
					$headerValue = trim(substr(reset($for), 4), " \t\n\r\0\x0B" . "\"[]");
					break;
				}
			}
		}

		return $headerValue;
	}


}




















