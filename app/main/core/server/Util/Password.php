<?php

/**
 * JingCafe
 *
 * @link 		
 * @license 
 */

namespace JingCafe\Core\Util;

/**
 * Passowrd utility class
 *
 * @author Mong cheng
 */

class Password 
{
	/**
	 * Returns the hashing type for a specified password again
	 * 
	 * Automatically detects the hash type: "sha1" (for UserCake legacy accounts), legacy(for 0.1.x accounts), and "modern" (used for new accounts)
	 *
	 * @param string 	$password 	The hash password 
	 * @param string 	sha1|legacy|modern
	 */
	public static function getHashType($password)
	{
		// If the password in the db is 65 characters long, we have an sha1-hashed password
		if (strlen($password) === 65) {
			return 'sha1';
		} elseif (substr($password, 0, 7) === '$2y$12$') {
			return 'legacy';
		}

		return 'modern';
	}

	/**
	 * Hashes a plaintext password using bcrypt
	 *
	 * @param string 	$password 	The plaintext password.
	 * @return string 	The hashed passowrd
	 * @throws HashFailedException
	 */
	public static function hash($password)
	{
		$hash = password_hash($password, PASSWORD_BCRYPT);

		if (!$hash) {
			throw new HashFailedException();
		}

		return $hash;
	}

	/**
	 * Verify a plaintext password against the user's hashed password
	 *
	 * @param string 	$password 	The plaintext password verify
	 * @param string 	$hashed 	The hash to compare against.
	 * @return bool 	True if the password mathes, false otherwise.
	 */
	public static function verify($password, $hash)
	{
		if (static::getHashType($hash) === 'sha1') {
			// Legacy UserCake passowrds
			$salt = substr($hash, 0, 25);
			$hashInput = $salt . sha1($salt . $password);

			return $hashInput === $hash;

		} elseif (static::getHashType($hash) === 'legacy') {
			/** 
			 * Homegroun implementation (assuming that current install has been using a cost parameter of 12)
			 * Used for manual implementation of bcrypt
			 */

			$cost = 12;

			return substr($hash, 0, 60) === crypt($password, '$2y$' . $cost . '$' . substr($hash, 60));
		}

		// Modern implementation
		return password_verify($password, $hash);
	}


}




