<?php

namespace JingCafe\Core\Database\Models;

/**
 * Verification Model
 * Represents a pending email verificaiton for the new user account
 * 
 * @property int 		user_id
 * @property token 		varchar varying(100)
 * @property datetime 	expired_at
 * @property bool 		completed
 * @property datetime  	completed_at
 */
class Verification extends Model
{	
	/**
	 * @var bool Enable timestamps for Verifications
	 */
	public $timestamps = false;

	/**
	 *@var string The name of the table for current model.
	 */
	protected $table = 'verifications';

	/**
	 * @var array
	 */
	protected $fillable = [
		'token',
		'user_id',
		'completed',
		'completed_at',
		'expired_at'
	];

	protected $token;

	public function setToken($token)
	{
		$this->token = $token;
		return $this;
	}

	public function getToken()
	{
		return $this->token;
	}

	/**
	 * Get the user assocated with verifcation request.
	 */
	public function user()
	{
		$classMapper = static::$container->classMapper;

		return $this->belongsTo($this->classMapper->getClassMapper('user'), 'user_id');
	}

}

