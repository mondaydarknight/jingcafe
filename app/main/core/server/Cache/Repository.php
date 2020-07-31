<?php


namespace JingCafe\Core\Cache;

use ArrayAccess;
use Illuminate\Support\Arr;


class Repository implements ArrayAccess, RepositoryInterface
{
	/**
     * All of the configuration items.
     *
     * @var array
     */
	protected $items = [];

    /**
     * Create a new configuration repository.
     *
     * @param  array  $items
     * @return void
     */
	public function __construct(array $items = [])
	{
		$this->items = $items;
	}

	/**
	 * Get all of configuation items for the application
	 *
	 * @return mixed
	 */
	public function all()
	{
		return $this->items;
	}

    /**
     * Set a given configuration value.
     *
     * @param  array|string  $key
     * @param  mixed   $value
     * @return void
     */
	public function set($key, $value) 
	{
		$keys = is_array($key) ? $key : [$key => $value]; 

		foreach ($keys as $key => $value) {
			Arr::set($this->items, $key, $value);
		}
	}

    /**
     * Get the specified configuration value.
     *
     * @param  string  $key
     * @param  mixed   $default
     * @return mixed
     */
	public function get($key, $default = null)
	{
		return Arr::get($this->items, $key, $default);
	}

    /**
     * Determine if the given configuration value exists.
     *
     * @param  string  $key
     * @return bool
     */
	public function has($key)
	{
		return Arr::has($this->items, $key);
	}

    /**
     * Clear value of items 
     *
     * @param  string  $key
     */
	public function remove($key)
	{
		$this->set($key, null);
	}

    /**
     * Push a value onto an array configuration value.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return void
     */
	public function push($key, $value)
	{
		$array = $this->get($key);

		array_push($array, $value);

		$this->set($key, $array);
	}

    /**
     * Prepend a value onto an array configuration value.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return void
     */
	public function prepend($key, $value)
	{
		$array = $this->get($key);

		array_unshift($array, $value);

		$this->set($key, $array);
	}

    /**
     * Set a configuration option.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return void
     */
	public function offsetSet($key, $value)
	{
		$this->set($key, $value);
	}

    /**
     * Get a configuration option.
     *
     * @param  string  $key
     * @return mixed
     */
	public function offsetGet($key)
	{
		return $this->get($key);
	}

    /**
     * Determine if the given configuration option exists.
     *
     * @param  string  $key
     * @return bool
     */
	public function offsetExists($key)
	{
		return $this->has($key);
	}

    /**
     * Get a configuration option.
     *
     * @param  string  $key
     * @return mixed
     */
	public function offsetUnset($key)
	{
		$this->remove($key);
	}

}
