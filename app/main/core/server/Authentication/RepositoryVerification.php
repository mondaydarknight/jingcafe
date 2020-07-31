<?php

namespace JingCafe\Core\Authentication;

use JingCafe\Core\Database\Models\User;

/**
 * Class RepositoryVerification
 *
 * The verifcation of user registration
 */
class RepositoryVerification extends TokenRepository
{
	/**
	 * {@inheritDoc}
	 */
	protected $modelIdentifier = 'verification';

	/**
	 * {@inheritDoc}
	 */
	protected function updateUser($user, $args)
	{
		$user->flag_verified = true;

		return $user->save();
	}


}

