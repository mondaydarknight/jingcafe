<?php

namespace JingCafe\Core\Database\Models;

/**
 * The cancel reasons
 * @author Mong Cheng
 */
class CancelReasons extends Model
{
	/**
	 * Enable timestamps for Product
	 */
	public $timestamps = false;

	/**
	 * The name of current table
	 * @var string
	 */
	protected $table = 'cancel_reasons';

	/**
	 * Field should be mass-assignable when creating a new Product
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'reason'
	];

}
