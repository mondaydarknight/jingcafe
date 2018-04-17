<?php



namespace JingCafe\Core\Util;

/**
 * Validator
 *
 * Validate request data 
 */

use InvalidArgumentException;

class Validator
{
	/**
	 * @var array
	 */
	protected $validUrlPrefixes = ['http://', 'https://', 'ftp://'];

	/**
	 * Validate the value is the string and change their type.
	 * @var string 	$value
	 * @return string|false
	 */
	public static function validateString($value) 
	{
		return filter_var($value, FILTER_SANITIZE_STRING);
	}


	/**
	 * Validate the value is the intgeger and change their type.
	 * @param string|int
	 * @param string|null 	$message 
	 */
	public static function validateInteger($value, $message = null) 
	{
		if (!$integer = filter_var($value, FILTER_VALIDATE_INT)) {
			throw new InvalidArgumentException($message);
		}
		
		return $integer;
	}

	/**
	 * Validate the value is the numeric and change their type.
	 * @param string|numeric
	 */
	public static function validateNumeric($value)
	{
		if (!is_numeric($value)) {
			throw new InvalidArgumentException('numeric data error');
		}

		return $value + 0;
	}


	/**
	 * Validate the value wether is float
	 *
	 * @param string|float
	 */
	public static function validateFloat($value, $message = null) 
	{
		if (!$float = filter_var($value, FILTER_VALIDATE_FLOAT)) {
			throw new InvalidArgumentException($message);
		}
		
		return $float;
	}

	/**
	 * Validate the value wether email type is correct
	 * 
	 * @param string 	$email
	 */
	public static function validateEmail($value, $message = null) 
	{
		if (!$email = filter_var((string) $value, FILTER_VALIDATE_EMAIL)) {
			throw new InvalidArgumentException('Email format is wrong.');
		}

		list($name, $domain) = explode('@', $email);
		if (!checkdnsrr($domain, 'MX')) {
			throw new InvalidArgumentException($message);
		}

		return $email;
	}

	
	/**
	 * Validate the value wether is phone type
	 * 
	 * @param string 
	 */
	public static function validatePhone($value) 
	{
		$value = preg_replace('/[^0-9]/', '', $value);

		if (strlen($value) !== 10 || mb_substr($value, 0, 2) !== '09') {
			throw new InvalidArgumentException('無效的電話號碼');
		}

		return $value;
	}

	/**
     * Validate that a field is a valid URL by syntax
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return string
     */
    public static function validateUrl($value, $message = null)
    {
        foreach (static::$validUrlPrefixes as $prefix) {
            if (strpos($value, $prefix) !== false) {
                if (!$url = filter_var($value, FILTER_VALIDATE_URL, FILTER_FLAG_PATH_REQUIRED)) {
                	throw new InvalidArgumentException($message);
                }
                return $url;
            }
        }

        throw new InvalidArgumentException($message);
    }

    /**
     * Validate that a field is an active URL by verifying DNS record
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateUrlActive($value, $message = null)
    {
        foreach (static::$validUrlPrefixes as $prefix) {
            if (strpos($value, $prefix) !== false) {
                $url = str_replace($prefix, '', strtolower($value));

                return checkdnsrr($url);
            }
        }

        throw new InvalidArgumentException($message);
    }

    /**
     * Validate that a field contains only alphabetic characters
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateAlpha($value, $message)
    {
        if (!preg_match('/^([a-z])+$/i', $value)) {
        	throw new InvalidArgumentException($message);
        }

        return $value;
    }

    /**
     * Validate that a field contains only alpha-numeric characters
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateAlphaNum($field, $value)
    {
    	 if (!preg_match('/^([a-z0-9])+$/i', $value)) {
        	throw new InvalidArgumentException($message);
        }

        return $value;
    }

    /**
     * Validate that a field contains only alpha-numeric characters, dashes, and underscores
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateSlug($field, $value)
    {
        return preg_match('/^([-a-z0-9_-])+$/i', $value);
    }

    /**
     * Validate that a field passes a regular expression check
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateRegex($value, $message = null, $expression)
    {   
    	if (!preg_match($expression, $value)) {
    		throw new InvalidArgumentException($message);
    	}
        
        return $value;
    }

    /**
     * Validate that a field is a valid date
     *
     *@param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateDate($value, $message = null)
    {
        $isDate = false;
        if (!$value instanceof \DateTime || strtotime($value) === false) {
            throw new InvalidArgumentException($message);
        } 

        return $value;
    }

    /**
     * Validate that a field matches a date format
     *
     * @param string 		$value
     * @param string|null 	$message
     * @param mixed
     * @throws InvalidArgumentException
     * @return bool
     */
    public function validateDateFormat($value, $message, $params)
    {
        $parsed = date_parse_from_format($params[0], $value);

        return $parsed['error_count'] === 0 && $parsed['warning_count'] === 0;
    }

    /**
     * Validate the date is before a given date
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @return bool
     */
    public function validateDateBefore($field, $value, $params)
    {
        $vtime = ($value instanceof \DateTime) ? $value->getTimestamp() : strtotime($value);
        $ptime = ($params[0] instanceof \DateTime) ? $params[0]->getTimestamp() : strtotime($params[0]);

        return $vtime < $ptime;
    }

    /**
     * Validate the date is after a given date
     *
     * @param  string 		$value
     * @param  string|null 	$message
     * @throws InvalidArgumentException
     * @internal param array $fields
     * @return bool
     */
    public function validateDateAfter($field, $value, $params)
    {
        $vtime = ($value instanceof \DateTime) ? $value->getTimestamp() : strtotime($value);
        $ptime = ($params[0] instanceof \DateTime) ? $params[0]->getTimestamp() : strtotime($params[0]);

        return $vtime > $ptime;
    }



    public static function validateMin($value, $message = null, $params)
    {
        if (static::stringLength($value) < (int)$params[0]) {
            throw new InvalidArgumentException($message);
        }

        return $value;
    }


    public static function validateMax($value, $message = null, $params)
    {
        if (static::stringLength($value) > (int)$params[0]) {
            throw new InvalidArgumentException($message);
        }

        return $value;
    }

    protected static function stringLength($value)
    {
        if (function_exists('mb_strlen')) {
            return mb_strlen($value);
        }

        return strlen($value);
    }


    /** 
     * Validate the data with no whitespace
     * @param string 		$value
     * @param string|null 	$message 	
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateNoLeadingWhitespace($value, $message = null)
    {
    	return static::validateRegex($value, $message, "/^\S.*$/");
    }

    /**
     * Validate the data with no whitespace
     * @param string        $value
     * @param string|null   $message    
     * @throws InvalidArgumentException
     * @return bool
     */
    public static function validateNoTrailingWhitespace($value, $message = null) {
        return static::validateRegex($value, $message, "/^.*\S$/");
    }

	/**
	 * Validate the value is boolean, only true can be validate 
	 * @param bool
	 */
	public static function validateBoolean($value) 
	{
		return $value === FALSE ? FALSE : filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
	}


}