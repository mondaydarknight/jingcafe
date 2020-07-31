<?php

namespace JingCafe\Core\Database\Models;

/**
 * The payment Model 
 *
 * @property id 			serial
 * @property name 			varchar varying(100)
 * @property payment_key 	character(50)
 * @property created_at		timestamp
 */
class Payment extends Model
{
	/** 
	 * Enable timestamps for User
	 * @var bool
	 */
	public $timestamps = false;

	/**
	 * @var payments
	 */
	protected $table = 'payments';

	/**
	 * Fields that should be mass-assignable when creating a new User.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'name',
		'brand',
		'profile',
		'created_at'
	];


	public function userPayment()
	{
		$classMapper = static::$container->classMapper;
		return $this->hasOne($classMapper->getClassMapper('userPayment'), 'payment_id');
	}


}

