<?php

namespace JingCafe\Core\Util;

/**
 * Util Class
 * Static utility
 *
 * @author Mong Cheng
 */
class Util
{
	private static $isMbstringAvailable = null;


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

	/** 
	 * Convert string to the camcelcase 
	 *
	 */
	public static function convertToCamelCase($value)
	{
		return str_replace(' ', '', ucwords(str_replace(['_', '-'], ' ', $value)));
	}

	/**
	 * Replace the char _ and convert behind char to uppercase for  columns of table
	 * @param array|object 	$columns
	 * @param array 		$omitList 	The list that not be overwrite
	 */
	public static function convertArrayKeyToCamelCase($columns, $omitList = [])
	{
		if (is_array($columns)) {
			foreach ($columns as $columnKey => $columnValue) {
				if (strpos($columnKey, '_') !== false) {
					$columns[lcfirst(Util::convertToCamelCase($columnKey))] = $columnValue;
					unset($columns[$columnKey]);
				}
			}
		} elseif (is_object($columns)) {
			foreach ($columns->toArray() as $columnKey => $columnValue) {
				if (strpos($columnKey, '_') !== false) {					
					unset($columns->{$columnKey});

					if (!in_array($columnKey, $omitList)) {
						$columns->{lcfirst(Util::convertToCamelCase($columnKey))} = $columnValue;
					}
				}
			}
		}
		
		return $columns;
	}


	public static function utf8($value)
	{
		if (!static::$isMbstringAvailable) {
			static::$isMbstringAvailable = function_exists('mb_detect_encoding');

			if (!static::$isMbstringAvailable) {
				trigger_error("It looks like the mbstring extension is not enabled. " .
                    "UTF-8 strings will not properly be encoded. Ask your system " .
                    "administrator to enable the mbstring extension, or write to " .
                    "support@stripe.com if you have any questions.", E_USER_WARNING);
			}
		}

		return is_string($value) && static::$isMbstringAvailable && mb_detect_encoding($value, "UTF-8", true) != "UTF-8" 
			? utf8_encode($value) : $value; 
	}

	/**
	 * @param array 	$arr 
	 * @param string 	$prefix
	 */
	public static function urlEncode($arr, $prefix = null)
	{
		if (!is_array($arr)) {
			return $arr;
		}

		$r = array();

		foreach ($arr as $key => $value) {
			if (is_null($value)) {
				continue;
			}

			if ($prefix) {
				if ($key !== null && (is_int($key) || is_array($value))) {
					$key = $prefix . '['. $key .']';
				} else {
					$key = $prefix . '[]';
				}
			}

			if (is_array($value)) {
                $enc = self::urlEncode($value, $key);
                if ($enc) {
                    $r[] = $enc;
                }
            } else {
                $r[] = urlencode($key)."=".urlencode($value);
            }
		}

		return implode("&", $r);
	}



	/**
	 * Convert array to json format
	 * Because of PHP Version 5.3, we can't use JSON_UNESCAPED_SLASHES option
	 * Instead we would use the str_replace command for now.
	 * 
	 * @todo Replace the code with return json_encode($this->toArray(), $options | 64);
	 * @param array $value
	 * @param int 	$options
	 */
	public static function toJson($value, $options = 0)
	{
		if (version_compare(phpversion(), '5.4.0', '>=') === true) {
			return json_encode($value, $options | 64);
		}

		return str_replace('\\/', '/', json_encode($value, $options));
	}

	/**
	 * Generate the secret key of GUID
	 *
	 * @return string
	 */
	public static function generateGuidKey($trim = true)
	{
		if (function_exists('com_create_guid') === true) {
        	return $trim === true ? trim(com_create_guid(), '{}') : com_create_guid();
  		}

		// return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
	
  		// For OSX / Linux
  		// Set version to 0100
  		// and set bits 6-7 to 10
  		if (function_exists('openssl_random_pseudo_bytes') === true) {
	        $data = openssl_random_pseudo_bytes(16);
	        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);    
	        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
	        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    	}

    	// Fallback (PHP 4.2+)
    	mt_srand((double)microtime() * 10000);
    	$charId = strtolower(md5(uniqid(rand(), true)));
    	$hyphen = chr(45);                  // "-"
    	$lbrace = $trim ? "" : chr(123);    // "{"
    	$rbrace = $trim ? "" : chr(125);    // "}"
    	$guidv4 = $lbrace.substr($charId,  0,  8).$hyphen.substr($charId,  8,  4).$hyphen.substr($charId, 12,  4).$hyphen.substr($charId, 16,  4).$hyphen.substr($charId, 20, 12).$rbrace;
    	return $guidv4;
	}

	/**
	 * Generate the random code
	 *
	 * @param int $length 
	 * @return string
	 */
	public static function generateRandomKey($length = 0)
	{
		return mb_substr(str_shuffle('_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, $length);
	}




}	