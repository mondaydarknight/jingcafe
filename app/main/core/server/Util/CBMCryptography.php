<?php

/**
 * CBMCryptography
 *
 * This is simple algorithm by CBM Delivery Company.
 * Every char encode by xor and base_64 
 *
 * @author Mong Cheng
 */
namespace JingCafe\Core\Util;

class CBMCryptography 
{

	/**
	 *	The algorithm of encryption.
	 *
	 * @param string 	$data 	
	 */
	public static function encrypt($data) {
		$crypttext = '';

		if (empty($data) || $data === '') {
			return '';
		}

		if (!is_string($data)) {
			throw new \InvalidArgumentException("The data type error, the data is not string type.");
		}

		$dataLength = mb_strlen($data);

		for ($index = 0; $index < $dataLength; $index++) {
			$char = unpack('C*', mb_convert_encoding(mb_substr($data, $index, 1), 'utf-16le'));
			// $char = mb_convert_encoding($char, 'utf-16le');
			// $char = unpack('C*', $char);

			switch (intval($char[1] ^ $char[2]) % 2) {
				case 0:
					$char = [0xFF - $char[1], 0xFF - $char[2]];
					break;
				
				case 1:
					$char = [0xFF - $char[2], 0xFF - $char[1]];
					break;
			}

			$crypttext .= base64_encode(implode(array_map('chr', $char)));
		}

		return $crypttext;
	}

	/**
	 * The algorithm of decryption of data value
	 *
	 * @param string 	$data 
	 */
	public static function decrypt($data) {
		$crypttext = '';

		if (!is_string($data)) {
			throw new \InvalidArgumentException("The data type error, the data is not string type.");
		}

		$dataLength = mb_strlen($data);

		if ($dataLength % 4 !== 0) {
			return;
		}

		for ($index = 0; $index < $dataLength; $index = $index + 4) {
			$charOrd = [];
			$char = base64_decode(mb_substr($data, $index, 4));
			// $char = base64_decode($char);

			/**
			 * Ord() is used to get the ASCII value of prefix of a string
			 */
			foreach (str_split($char) as $ascii) {
				$charOrd[] = sprintf('%08b', ord($ascii));
			}

			switch (intval(bindec($charOrd[0]) ^ bindec($charOrd[1])) % 2) {
				case 0:
					$charOrd = [0xFF - bindec($charOrd[0]), 0xFF - bindec($charOrd[1])];
					break;
				
				case 1:
					$charOrd = [0xFF - bindec($charOrd[1]), 0xFF - bindec($charOrd[0])];
					break;
			}

			$crypttext .= mb_convert_encoding(implode(array_map('chr', $charOrd)), 'utf-8', 'utf-16le');
		}

		return $crypttext;
	}

}












