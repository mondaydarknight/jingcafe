<?php

namespace JingCafe\Core\Util\Traits;

use Closure;
use BadMethodCallException;

trait Macroable 
{
	/**
	 * The registered string macros
	 *
	 * @var array
	 */
	protected static $macros = [];

	/**
	 * Register a custom macro
	 * 
	 * @param string 	$name
	 * @param callable 	$macro
	 * @return void
	 */
	public static function macro($name, callable $macro)
	{
		static::$macros[$name] = $macro;
	}

	/**
	 * Check if macro is registered 
	 * @return bool
	 */
	public static function hasMacro($name)
	{
		return isset(static::$macros[$name]);
	}

	/**
	 * Dynamically handle calls to the class
	 * 
	 * @param string 	$method
	 * @param array 	$parameters
	 *
	 * @return mixed
	 *
	 * @throws \BadMethodCallException
	 */
	public static function __callStatic($method, $arguments)
	{
		if (!isset(static::hasMacro($method))) {
			throw new BadMethodCallException("Method {$method} does not exist.");
		}

		if (static::$macros[$method] instanceof Closure) {
			return call_user_func_array(Closure::bind(static::$macros[$name], null, static::class), $parameters);
		}

		return call_user_func_array(static::$macros[$method], $parameters);
	}

	/**
	 * Dynamically handle calls to the class
	 * 
	 * @param string 	$method
	 * @param array 	$arguments
	 * @return mixed
	 *
	 * @throws \BadMethodCallException
	 */
	public function __call($method, $arguments)
	{
		if (!isset(static::hasMacro($method))) {
			throw new BadMethodCallException("Method {$method} does not exist.");
		}

		if (static::$macros[$method] instanceof Closure) {
			return call_user_func_array(static::$macros[$method]->bindTo($this, static::class), $parameters);
		}

		return call_user_func_array(static::$macros[$method], $parameters);
	}

}
