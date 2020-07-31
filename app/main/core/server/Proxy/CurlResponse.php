<?php

namespace JingCafe\Core\Proxy;

/**
 * Parse the response from the Curl request into object
 * Contain the response body and associative array of headers
 *
 * @package curl
 * @author Sean Huber <shuber@huberry.com>
 */
class CurlResponse
{

    /**
     * The body of the response without the headers block
     * @var string
     */
    public $body = '';

    /**
     * An associative array containing the response's headers
     * @var array
     */
    public $headers = [];


    public $response;

    /**
     * Accept the result of the curl request as a string
     * 
     * <code>
     * $resposne = new CurlResponse(curl_exec($curl_handler))
     * echo $response->body
     * echo $response->headers['status']
     * </code>
     *
     * @param string $response
     */
    public function __construct($response)
    {
        # Headers regex
        $pattern = '#HTTP/\d\.\d.*?$.*?\r\n\r\n#ims';

        # Extract headers from response 
        preg_match_all($pattern, $response, $matches);
        $header = array_pop($matches[0]);
        $headers = explode("\r\n", str_replace("\r\n\r\n", '', $header));

        # Remove headers from the response body
        $this->body = str_replace($header, '', $response);

        # Extract the version and status from the first header
        $versionStatus = array_shift($headers);

        preg_match('#HTTP/(\d\.\d)\s(\d\d\d)\s(.*)#', $versionStatus, $matches);

        $this->headers['http_version'] = $matches[1];
        $this->headers['status_code'] = (int)$matches[2];
        $this->headers['status'] = $matches[2] . ' ' . $matches[3];

        # Convert headers into an associative array 
        foreach ($headers as $header) {
            preg_match('#(.*?)\:\s(.*)#', $header, $matches);
            $this->headers[$matches[1]] = $matches[2];
        }
    }

    /**
     * Return the response body
     * 
     * <code>
     * $curl = new Curl;                                                    
     * $response = $curl->get('google.com');
     * echo $response->body
     * </code>
     */
    public function __toString()
    {
        return $this->body;
    }

}

