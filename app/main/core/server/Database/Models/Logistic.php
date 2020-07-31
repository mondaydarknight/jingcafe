<?php

namespace JingCafe\Core\Database\Models;


/**
 * The Model for logistic center 
 *
 * @property id 			serial
 * @property name 			varchar varying(100)
 * @property logstic_key 	character(50)
 */
class Logistic extends Model 
{
	/**
	 * Set enabled false to timestamp column
	 */
	public $timestamps = false;

	/**
	 * @var table
	 */
	protected $table = 'logistics';


	/**
	 * @var The property of table
	 */
	protected $fillable = [
		'name',
		'brand',
		'fee',
		'profile',
		'average_time',
		'official_url',
		'url'
	];



	public function userLogistic()
	{
		$classMapper = static::$container->classMapper;

		return $this->hasOne($classMapper->getClassMapper('userLogistic'), 'logistic_id');
	}



}





