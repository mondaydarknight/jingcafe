<?php


namespace JingCafe\Core\Schema;


/**
 * RequestSchema
 *
 * Reference of schema for an HTTP request. Complete with the WDVSS standard (https://github.com/alexweissman)
 *
 */

use JingCafe\Core\File\YamlFileLoader;

class RequestSchema extends RequestSchemaRepository
{

	protected $loader;

	/**
	 * Loads the request schema from a file.
	 * 
	 * @param string 	$path 	The full path to the file containing with WDVSS standard
	 */
	public function __construct($path = null)
	{
		$this->items = [];

		if (!is_null($path)) {
			$this->loader = new YamlFileLoader($path);

			$this->items = $this->loader->load();
		}
	}


	/**
	 * @deprecated since 4.1
	 * @return array The schema data.
	 */
	public function getSchema()
	{
		return $this->items;
	}


	/**
	 * @deprecated since 4.1
	 * @param string 	$path 	Path to the schema file
	 * @throws Exception 		The file does not exist or is not a valid format.
	 */
	public function loadSchema()
	{
		return $this->load($path);
	}

}