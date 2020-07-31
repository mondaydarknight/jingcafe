<?php

namespace JingCafe\Core\Store;

use InvalidArgumentException;
use UnexpectedValueException;

class StoreManager
{
	/**
	 * The collection of stores
	 * @var array
	 */
	protected static $stores = [];

	/**
	 * Create the store service.
	 *
	 * @param array 	$options
	 */
	public static function create(array $options)
	{
		if (!isset($options['brand'])) {
			throw new InvalidArgumentException('The brand must be specified.');
		}

		switch (strtolower($options['brand'])) {
			case 'ibon':
				return new IbonStore($options);
			case 'family':
				return new FamilyStore($options);
			case 'hilife':
				return new HiLifeStore($options);
		}

		throw new InvalidArgumentException("Unsupported driver [{$config['driver']}]");
	}

	/**
	 * 
	 *
	 */
	public static function store(array $config)
	{
		if (!isset($config['brand'])) {
			throw new InvalidArgumentException('The brand of config must be specified');
		}

		if (!isset(static::$stores[$config['brand']])) {
			$createMethod = 'create'.lcfirst($config['brand']).'Method';

			if (!method_exists(static::class, $createMethod)) {
				throw new UnexpectedValueException("Undefined method {$createMethod}.");
			}

			static::$stores[$config['brand']] = static::{$createMethod}($config);
		}

		return static::$stores[$config['brand']];
	}

	/**
	 * Create the Ibon Store 
	 *
	 * @param array $conifg
	 * @return Store
	 */
	protected static function createIbonMethod(array $config)
	{
		return new IbonStore($config);
	}

	/**
	 * Create the FamilyMart store
	 *
	 * @param array $config
	 * @return Store
	 */
	protected static function createFamilyMethod(array $config)
	{
		return new FamilyStore($config);
	}

	/**
	 * Create the Hilife stroe
	 *
	 * @param array $config
	 * @return Store
	 */
	protected static function createHilifeMethod(array $config)
	{
		return new HiLifeStore($config);
	}

	
}