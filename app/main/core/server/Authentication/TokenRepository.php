<?php

namespace JingCafe\Core\Authentication;

use Carbon\Carbon;
use JingCafe\Core\Database\Models\User;
use JingCafe\Core\Util\ClassMapper;


/**
 * An abstract class for interacting with a repository of time-sensitve user tokens.
 *
 * User tokens are used, perform password resets and new account email verification.
 */
abstract class TokenRepository
{
	/**
	 * @var ClassMapper
	 */
	protected $classMapper;

	/**
	 * @var string 	The algorithm method of encryption.
	 */
	protected $algorithm;

	/**
	 * @var string 	Model
	 */ 
	protected $modelIdentifier;


	/**
	 * Create a new TokenRepository object.
	 *
	 * @param ClassMapper 
	 * @param string 		The hashing algorithm to use when storing generated tokens.
	 */
	public function __construct(ClassMapper $classMapper, $algorithm = 'sha512')
	{
		$this->classMapper = $classMapper;
		$this->algorithm = $algorithm;
	}

	/**
	 * Create a new token for specific user.
	 *
	 * @param User 	$user 		The user object associate with the token.
	 * @param int 	$timeout 	Determine the expiration of verification
	 * @param Model 			The model(PasswordReset, Verification)
	 */
	public function create(User $user, $timeout)
	{
		$this->removeExisting($user);

		$expiredAt = Carbon::now()->addSeconds($timeout);

		$model = $this->classMapper->createInstance($this->modelIdentifier);
		$model->setToken($this->generateRandomToken());

		$token = hash($this->algorithm, $model->getToken());

		$model->user_id = $user->id;
	
		$model->fill([
			'token'			=> $token,
			'completed'		=> false,
			'expired_at' 	=> $expiredAt
		]);

		$model->save();

		return $model;
	}

	/**
	 * Complete a token-based process, invoking updateUser() in the child object to actual action.
	 *
	 * @param int 		$token 		The token to complete
	 * @param mixed[] 	$userParams	An optional list of parameters to pass to updateUser()
	 * @return Model|false 	
	 */
	public function complete($token, $userParams = []) 
	{
		$token = hash($this->algorithm, $token);

		// Find the unexpired, incomplete toeken for specific user
		$model = $this->classMapper->staticMethod($this->modelIdentifier, 'where', 'token', $token)
			->where('completed', false)
			->where('expired_at', '>', Carbon::now())
			->first();

		if ($model === null) {			
			return false;
		}

		$user = $this->classMapper->staticMethod('user', 'find', $model->user_id);

		if (!$user) {
			return false;
		}

		$this->updateUser($user, $userParams);

		$model->fill([
			'completed' 	=> true,
			'completed_at'	=> Carbon::now()
		]);

		$model->save();

		return $model;
	}

	/**
	 * Cancel the specific token by removing it from the database
	 *
	 * @param int 	$token 	The token which need to remove
	 * @param Model|false
	 */
	public function cancel($token)
	{
		$token = hash($this->algorithm, $token);

		$model = $this->classMapper->staticMethod($this->modelIdentifier, 'where', 'token', $token)
			->where('completed', false)
			->first();

		if (!$model) {
			return false;
		}

		$model->delete();

		return $model;
	}

	/**
	 * Determine whether the user has incomplete and unexpired token 
	 * 
	 * @param User 	$user 	The user object to look up.
	 * @param int 	$token 	Optionally, try to match a specific token.
	 * @return Model|false
	 */
	public function exists(User $user, $token = null)
	{	
		$model = $this->classMapper->staticMethod('user', 'where', 'user_id', $user->id)
			->where('completed', false)
			->where('expired_at', '>', Carbon::now())
			->first();

		if ($token) {
			$hash = hash($this->algorithm, $token);			
			$model->where('hash', $hash);
		}

		return $model->first() ?: false;
	}

	/**
	 * Remove all expired tokens from the databases.
	 *
	 * @return bool|null
	 */
	public function removeExpired()
	{
		return $this->classMapper->staticMethod($this->modelIdentifier, 'where', 'completed', false)
			->where('expired_at', '<', Carbon::now())
			->delete();
	}

	/**
	 * Generatea new random token for this user.
	 * 	
	 * This generates a token to use for verifying a new account, resetting a lost password, etc.
	 * @param string 	$password 	Specify an existing token if we happen to generate the same value, we should regenerate on.
	 * @return string
	 */
	protected function generateRandomToken()
	{
		do {
			$token = md5(uniqid(mt_rand(), false));
		} while($this->classMapper->staticMethod($this->modelIdentifier, 'where', 'token', hash($this->algorithm, $token))->first());

		return $token;
	}	

	/**
	 * Delete all existing tokens from the databases from a particular user
	 * 
	 * @param User 	$user
	 * @return int
	 */
	protected function removeExisting(User $user)
	{
		return $this->classMapper->staticMethod($this->modelIdentifier, 'where', 'user_id', $user->id)
			->delete();
	}

	/**
	 * Modify the user during the token process.
	 * This method is called during complete() and is a way for concrete implementations to modify the user.
	 * 
	 * @param User 		$user 	The user objectto modify.
	 * @return mixed[] 	$args 	The listn of parameters that were supplied to the  call to complete()
	 */
	abstract protected function updateUser($user, $args);
}

