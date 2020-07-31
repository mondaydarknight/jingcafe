<?php


namespace JingCafe\Core\Database\Models;


/** 
 * The model for User Logistic
 *
 *
 * @author Mong Cheng.
 */
class UserLogistic extends Model
{
	/**
	 * @var bool Set enabled false to timestamp 
	 */
	public $timestamps = false;

	/**
	 * @var array The table name
	 */
	protected $table = 'user_logistics';

	/**
	 * @var array The table columns
	 */
	protected $fillable = [
		'username',
		'phone',
		'address',
		'user_id',
		'logistic_id',
		'created_at'
	];

	public function logistic()
	{
		$classMapper = static::$container->classMapper;
		return $this->belongsTo($classMapper->getClassMapper('logistic'), 'logistic_id');
	}


}

