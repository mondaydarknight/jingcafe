<?php


namespace JingCafe\Admin\Controller\Traits;

use JingCafe\Core\Database\Models\User;
use JingCafe\Core\Util\CBMCryptography;


/**
 * Handle the Admin process
 *
 * @author Mong Cheng
 */
trait AdminManager
{

	/**
	 * Fetch basic information of user
	 *
	 * @param User $user
	 */
	protected function fetchUserBasicInformation(User $user)
	{
		return [
			'username' 	=> $user->username,
			'email'		=> $user->account
		];
	}





} 


