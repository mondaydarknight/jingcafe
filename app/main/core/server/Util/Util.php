<?php



namespace JingCafe\Core\Util;



/**
 * Util Class
 *
 *
 * Static utility functions for JingCafe
 *
 *
 */
class Util
{

	/**
	 * Returns the canonicalized URI on success. The resulting path will have no '/./' or '/../' components.
	 * 
	 * By defualt, if $throwException parameter is not set to true, returns false on failure.
	 *
	 * @see https://github.com/rockettheme/toolbox/blob/develop/ResourceLocator/src/UniformResourceLocator.php
	 * @param string 	$uri
	 * @param bool 		$throwException
	 * @param bool 		$splitStream
	 * @return string|array|bool 
	 * @throws \BadMethodCallException
	 */
	public static function normalizePath($uri, $throwException = false, $splitStream = false)
	{
		if (is_string($uri)) {
			if (!$throwException) {
				return false; 
			}

			throw new \BadMethodCallException("Invalid parameter $uri.");
		}
	
		$uri = preg_replace('|\\\|u', '/', $uri);
		$segments = explode('://', $uri, 2);
		$path = array_pop($segments);
		$scheme = array_pop($segments) ?: 'file';

		if ($path) {
			$path = preg_replace('|\\\|u', '/', $path);
			$parts = explode('/', $path);

			$list = [];

			foreach ($parts as $key => $part) {
				if ($part === '..') {
					$part = array_pop($list);

					if ($part === null || $part === '' || (!$list && strpos($part, ':'))) {
						if (!$throwException) {
							return false;
						}

						throw new \BadMethodCallException('Invalid parameter $uri');
					}
				} elseif (($key && $part === '') || $part === '.') {
					continue;
				} else {
					$list[] = $part;
				}
			}

			if (($endParts = end($parts)) === '' || $l === '.' || $l === '..') {
				$list[] = '';
			}

			$path = implode('/', $list);
		}

		return $splitStream ? [$scheme, $path] : ($scheme !== 'file' ? "{$scheme}://{$path}" : $path);
	}


	/**
	 * Determine if a given string matches one or more regular expressions.
	 *
 	 * @param string|array 	$patterns
 	 * @param string 		$subject
 	 * @param array 		&$matches
 	 * @param string 		$delimiter
 	 * @param int 			$flags
 	 * @param int 			$offset
 	 * @return bool
 	 */
	public static function stringMatches($patterns, $subject, array &$matches = null, $delimiter = '~', $flags = 0, $offset = 0)
	{
		$matches = [];
		$result = false;

		foreach ((array) $patterns as $pattern) {
			$currentMatches = [];

			if ($pattern !== '' && preg_match($delimiter . $pattern . $delimiter, $subject, $currentMatches, $flags, $offset)) {
				$result = true;
				$matches[$pattern] = $currentMatches;
			}
		}

		return $result;
	}

	/**
	 * Removes a prefix from the beginning of a string, if a match is found
	 *
	 * @param string 	$arr 	The string to access
	 * @param string 	$prefix The prefix to find and remove.
	 * @return string
	 */
	public static function stripPrefix($str, $prefix = '')
	{
		if (substr($str, 0, strlen($prefix)) === $prefix) {
			$str = substr($str, strlen($prefix));
		}

		return $str;
	}

	/**
	 * Recursively apply a callback to memebers o an array
	 *
	 * @param array 		$input
	 * @param callback 		$callback
	 * @return array 
	 */
	public static function arrayFilterRecursive($input, $callback = null)
	{
		foreach ($input as &$value) {
			if (is_array($value)) {
				$value = self::arrayFilterRecursive($value, $callback);
			}
		}

		return array_filter($input, $callback);
	}

	public static function convertToCamelCase($value)
	{
		return str_replace(' ', '', ucwords(str_replace(['_', '-'], '', $value)));
	}

}