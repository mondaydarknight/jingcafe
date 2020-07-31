<?php

namespace JingCafe\Core\ServiceProvider;

use JingCafe\Core\Exception\NotFoundException;
use JingCafe\Core\Schema\RequestSchema;

class StatementService
{
	private static $instance;

	/**
	 * @var obejct
	 */
	protected $locator;

	/**
	 * @var array 
	 */
	protected $schema;

	/**
	 * @var array
	 */
	protected $statement;

	/**
	 * The do
	 * @var array
	 */
	protected $statements = [
		'shop' => [
			'file'	=> 'shop.yaml'
		],
		'purchase' => [
			'file' 	=> 'purchase-statement.yaml'
		],
		'order' => [
			'file'	=> 'order-statement.yaml'
		],
		'privacy' => [
			'file'	=> 'privacy-statement.yaml'
		]
	];
	
	private function __construct()
	{
	}

	public static function build($locator, $type)
	{
		if (!static::$instance) {
			static::$instance = new static;
		}

		if (!isset(static::$instance->statements[$type])) {
			throw new NotFoundException('Unknown statement type.');
		}

		static::$instance->statement = static::$instance->statements[$type];
		static::$instance->locator = $locator;
		static::$instance->loadFile();

		return static::$instance;
	}


	public function getFile()
	{
		return $this->schema->all();
	}

	/**
	 * Load the schema file (YAML)
	 * 
	 */
	protected function loadFile()
	{
		$this->schema = new RequestSchema($this->locator->findResource("schema://{$this->statement['file']}"));
	
		if (!$this->schema) {
			throw new NotFoundException("The file path {$this->statement['file']} was invalid.");
		}
	}

}









