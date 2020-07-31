<?php


namespace JingCafe\Core\Database\Models;

/**
 * The UserPayment Model
 *
 * @property id 			serial
 * @property account 		varchar varying(100)
 * @property user_id 		int
 * @property payment_id 	int
 * @property crerated_at	timestamp
 */
class UserPayment extends Model
{
	/** 
	 * Enable timestamps for User
	 * @var bool
	 */
	public $timestamps = false;

	/**
	 * @var payments
	 */
	protected $table = 'user_payments';

	/**
	 * Fields that should be mass-assignable when creating a new User.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'branch_name',
		'account',
		'card_number',
		'user_id',
		'payment_id',
		'level',
		'created_at'
	];


	public function payment()
	{
		$classMapper = static::$container->classMapper;
		return $this->belongsTo($classMapper->getClassMapper('payment'), 'payment_id');
	}


}



