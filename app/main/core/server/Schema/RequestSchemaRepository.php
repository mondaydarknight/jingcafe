<?php


namespace JingCafe\Core\Schema;


/**
 * Represents a schema for an HTTP request, compliant with the WDVSS standard 
 *
 *
 */

use JingCafe\Core\Util\Repository;

class RequestSchemaRepository extends Repository implements RequestSchemaInterface
{

	/**
	 * {@inheritDoc}
	 */
	public function setDefault($field, $value)
	{
		if (!isset($this->items[$field])) {
			$this->items[$field] = [];
		}

		$this->items[$field]['default'] = $value;

		return $this;
	}

	/**
	 * {@inheritDoc}
	 */
	public function addValidator($field, $validatorName, array $parameters = [])
	{
		if (!isset($this->items[$field])) {
			$this->items[$field] = [];
		}

		if (!isset($this->items[$field]['validators'])) {
			$this->items[$field]['validators'] = [];
		}

		$this->items[$field]['validators'][$validatorName] = $parameters;
		return $this;
	}

	/**
	 * {@inheritDoc}
	 */
	public function removeValidator($field, $validatorName)
	{
		unset($this->items[$field]['validators'][$validatorName]);
		return $this;
	}

	/**
	 * {@inheritDoc}
	 */
	public function setTransformations($field, $transformations = [])
	{
		if (!is_array($transformations)) {
			$transformations = [$transformations];
		}

		if (!isset($this->items[$field])) {
			$this->items[$field] = []; 
		}

		$this->items[$field]['transformations'] = $transformations;
		return $this;
	}

}


