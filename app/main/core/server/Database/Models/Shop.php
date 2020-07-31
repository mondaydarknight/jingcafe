<?php

namespace JingCafe\Core\Database\Models;

use Exception;

class Shop extends Model
{

	/**
	 * The name of current table
	 * @var string
	 */
	protected $table = 'shop';

	/**
	 * Field should be mass-assignable when creating a new Product
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'name',
		'brand',
		'phone',
		'address',
		'shop_owner_id',
		'introduction',
		'start_time',
		'end_time',
		'opening_day',
		'shop_owner_id',
		'flag_enabled'
	];

	/**
	 * Enable timestamps for Product
	 */
	public $timestamps = false;

	/**
	 * Get activities of the shop
	 *
	 * @param int 	$shopId
	 */
	public function activities()
	{
		return $this->hasMany('JingCafe\Core\Database\Models\Activity');
	}


}
