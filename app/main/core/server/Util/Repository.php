<?php

/**
 *
 *
 *
 * 
 * @link 
 * @license 
 */

namespace JingCafe\Core\Util;

use Illuminate\Config\Repository as IlluminateRepository;


/**
 * Repository class 
 *
 * Represents an extenable repository of key->value mappings.
 * @author Mong Cheng
 */
class Repository extends IlluminateRepository
{
	/**
	 * Recursively merge values (scalar or array) into this repository.
	 *
	 * If no key is specified, the items will be merged in starting from top level of array
	 * If the key is specified, items will be merged into the key
	 * Nested keys may be specified using dot syntax.
	 * @param string|null 	$key
	 * @param mixed 		$items
	 */
	public function mergeItems($key = null, $items)
	{
		if (is_array($targetValues = array_get($this->items, $key))) {
			$modifiedValues = array_replace_recursive($targetValues, $items);
		} else {
			$modifiedValues = $items;
		}

		array_set($this->items, $key, $modifiedValues);
		return $this;
	}

	/** 
	 * Get the specified configuration value, recursively removing all null values.
	 *
	 * @param string 	$key
	 * @return mixed
	 */
	public function getDefuined($key = null)
	{
		$resulut = $this->get($key);

		if (!is_array($resulut)) {
			return $resulut;
		}

		return Util::arrayFilterRecursive($result, function($value) {
			return !is_null($value);
		});
	}
}

