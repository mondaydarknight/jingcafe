<?php

namespace JingCafe\Core\Util;

/**
 *
 * Initialize the vector(IV) has to be the same when encryption or decryption
 *
 * @author Mong Cheng.
 */
class OpenSSLCryptography
{	
	/** 
	 * @var string  The hash method
	 */
	const HASH_METHOD = 'sha512';

	/**
	 * @var string 	The encryption method
	 */
	const ENCRYPT_METHOD = 'AES-256-CBC';

	/**
	 * @var string 	The secret vector
	 */
	protected static $secretVector = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	/**
	 * @var string 
	 */
	protected static $hashKey;

	/**
	 * @var string
	 */
	protected static $vector;

	/**
	 * The simple method to encrypt a plain text string
	 * @param string 	$value
	 */
	public static function encrypt($value, $secretKey = \JingCafe\NAME)
	{
		// $hashKey = hash(static::HASH_METHOD, $secretKey);

		// $vector = mb_substr(hash(static::HASH_METHOD, static::$secretVector), 0, 16);
		static::process($secretKey);
		return base64_encode(openssl_encrypt($value, static::ENCRYPT_METHOD, static::$hashKey, 0, static::$vector));
	}

	/**
	 * The simple method to decrypt a plain text string.
	 * @param string 	$value
	 */
	public static function decrypt($value, $secretKey = \JingCafe\NAME)
	{	
		static::process($secretKey);
		return openssl_decrypt(base64_decode($value), static::ENCRYPT_METHOD, static::$hashKey, 0, static::$vector);
	}

	/**
	 * @var string 	$secretKey
	 */ 
	private static function process($secretKey)
	{
		static::$hashKey = hash(static::HASH_METHOD, $secretKey);

		static::$vector = mb_substr(hash(static::HASH_METHOD, static::$secretVector), 0, 16);
	}

}

