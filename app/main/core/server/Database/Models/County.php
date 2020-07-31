<?php

namespace JingCafe\Core\Database\Models;

/**
 * The Model for Counties center 
 *
 * @property id 			serial
 * @property name 			varchar varying(20)
 */
class County extends Model
{
	/**
	 * Disable the timestamps settings.
	 */
	public $timestamps = false;

	/**
	 * @var table
	 */
	protected $table = 'counties';


	/**
	 * @var The property of table
	 */
	protected $fillable = [
		'name'
	];


	

}

