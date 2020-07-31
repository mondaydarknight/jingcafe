<?php

namespace JingCafe\Core\ServiceProvider;

use Psr\Http\Message\ServerRequestInterface;
use JingCafe\Core\Exception\MalformedRequestBodyException;

class JsonStrategy 
{

	public function match($contentType)
	{
		$parts = explode(';', $contentType);
		$mime = array_shift($parts);

		return (bool) preg_match('#[/+]json$#', trim($mime));
	}


	public function parse(ServerRequestInterface $request)
	{
		$rawBody = (string) $request->getBody();
		$parsedBody = json_decode($rawBody, true);

		if (!empty($rawBody) && json_last_error() !== JSON_ERROR_NONE) {
			throw new MalformedRequestBodyException(sprintf('Error when parsing JSON request body: %s', json_last_error_msg()));
		}

		return $request
			->withAttribute('rawBody', $rawBody)
			->withParsedBody($parsedBody);
	}

}


