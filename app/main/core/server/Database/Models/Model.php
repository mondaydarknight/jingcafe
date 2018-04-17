<?php

/**
 * JingCafe
 *
 * @link 
 * @license
 */

namespace JingCafe\Core\Database\Models;

use Interop\Container\ContainerInterface;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model as LaravelModel;


abstract class Model extends LaravelModel
{
	/**
	 * @var ContainerInterface	The DI container for your application
	 */
	public static $container;

	/**
	 * @var bool 	Disable timestamp for now 
	 */
	public $tiimestamps = false;

	/**
	 * Construct 
	 * @param array 	$attributes
	 */
	public function __construct(array $attributes = [])
	{
		// Hacky way to force DB 
		static::$container['db'];

		parent::__construct($attributes);
	}

	/**
	 * Determine if an attribute exists on the model - even if it is null.
	 *
	 * @param string 	$key
	 * @return bool
	 */
	public function attributeExists($key)
	{
		return array_key_exists($key, $this->attributes);
	}

	/**
	 * Determine whether a model exists by checking a unique column, including checking soft-deleted records.
	 * 
	 * @param mixed 	$value
	 * @param string 	$identifier
	 * @param bool 		$checkDeleted 	Set to true to include soft-deleted records
	 * @return 			\JingCafe\Core\Database\Models\Model|null
	 */
	public static function findUnique($identifier, $value, $checkDeleted = false)
	{
		$query = static::where($identifier, $value);

		if ($checkDeleted) {
			$query = $query->withTrashed();
		}

		return $query->first();
	}

	/**
	 * Set Container Service
	 *
	 * @param ContainerInterface
	 */
	public static function setContainer(ContainerInterface $container)
	{
		static::$container = $container;
	}

	/**
	 * Store the object in the DB, creating a new row if one doesn't already exist.
	 *
	 * Calls save(), then returns the id of the new record in the database.
	 * @return int 	The id of this object.
	 */
	public function store()
	{
		$this->save();

		// Store function should always return the id of project.
		return $this->id;
	}

	/**
	 * Get the properties of this object as an associative array. Alias for toArray()
	 *
	 * @deprecated since 4.1.8 There is no point in having this alias.
	 * @return array
	 */
	public function export()
	{
		return $this->toArray();
	}

	/**
	 * Determine if an relation exists on the model, event it's null.
	 *
	 * @param string 	$key
	 * @return bool
	 */
	public function relationExists($key)
	{
		// return array_key_exists($key, $this->relations);
	}


	/**
	 * Get the format for database stored dates.
	 * 
	 * @return string
	 */
	public function getDateFormat()
	{
		return 'Y-m-d H:i:s.u';
	}

	/**
	 * For raw array fetching. Must be static, otherwise PHP gets confused about where to find $table.
	 *
	 * @deprecated since 4.1.8 setFetchMode is no longer available as of Laravel 5.4.
     * @link https://github.com/laravel/framework/issues/17728
	 */
	public static function queryBuilder()
	{
		// Set query builder result such as fetch associative array (instead of creating stdClass objects).
		DB::connection()->setFetchMode(\PDO::FETCH_ASSOC);
        return DB::table(static::$table);
	}

}