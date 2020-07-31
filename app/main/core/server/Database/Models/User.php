<?php


namespace JingCafe\Core\Database\Models;

use Carbon\Carbon;
use Illuminate\Database\Capsule\Manager as Capsule;
use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Util\Password;

class User extends Model
{
	/**
	 * Encrypted columns
	 *
	 * @var array 
	 */
	protected static $encryptedColumns = [
		'username',
		'account',
		'phone'
	];


	/** 
	 * Enable timestamps for User
	 * @var bool
	 */
	public $timestamps = false;



	/**
	 * The name of the table of current table
	 *
	 * @var string
	 */
	protected $table = 'users';


	/**
	 * Fields that should be mass-assignable when creating a new User.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'username',
		'account',
		'password',
		'sex',
		'phone',
		'profile',
		'address',
		'rank',
		'flag_verified',
		'flag_enabled',
		'token',
		'create_time',
		'last_access_time'
	];
	
	/**
	 * A list of attributes to hide by default when using toArray() and toJson()
	 *
	 * @link https://laravel.com/docs/5.4/eloquent-serialization#hiding-attributes-from-json
     * @var string[]
	 */
	protected $hidden = [
		'password'
	];


	/**
	 * The attribute shoud be mutated to data
	 *
	 * @var string[]
	 */
	// protected $dates = [
	// 	'delete_at'
	// ];

	// protected $appends = [
	// 	'username'
	// ];


	/**
	 * Cached dictionary of permission for the user
	 *
	 * @var array
	 */
	protected $cachedPermissions;




	/**
	 * Determine whether a user exist, including checking soft-deleted records.
	 *
	 * @deprecated since 4.1.7 This method conflicts with and ovverides the Builder::exists() method. Use Model::findUnique() instead.
	 *
	 * @param mixed 	$value
	 * @param string 	$identifier
	 * @param bool 		$checkDelete 	Set to true to include soft-deleted records
	 * @return User|null 
	 */
	public static function exists($value, $identifier = 'username', $checkDeleted = true)
	{
		return static::findUnique($value, $identifier, $checkDeleted);
	}

	
	/**
	 * Get specific info of  user_logistics by binding with user_id
	 * @param int 	The user id
	 */
	public static function withQuerySpecificUserById($userId)
	{
		return function($query) use ($userId) {
			return $query->where('user_id', $userId);
		};
	}

	/** 
	 * Encrypt or decrypt user by match encrytpedColumns columns
	 *
	 * @param array|User 	$user
	 * @param bool 			$isEncrypted
	 *
	 * @return array 
	 */
	public static function encryptOrDecryptUser($user, $isEncrypted = true)
	{
		foreach (static::$encryptedColumns as $column) {
			if (isset($user[$column])) {
				$user[$column] = $isEncrypted ? CBMCryptography::encrypt($user[$column]) : CBMCryptography::decrypt($user[$column]);
			}
		}
		
		return $user;
	}


	/** 
	 * Get all activities for this user
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\HasMany
	 */
	public function activities()
	{
		$classMapper = static::$container->classMapper;
		return $this->hasMany($classMapper->staticMethod('activity'), 'user_id');

		// $this->belongsTo($classMapper->getClassMapper('group'), 'group_id');
	}


	/**
	 * Delete this user from database, along with any linked roles and activities
	 *
	 * @param bool $hardDelete	Set to true to completely remove the user and all associated objects.
	 * @return bool 			True if the deletion was successful, false otherwise.
	 */
	public function delete($hardDelete = false)
	{
		$classMapper = static::$container->classMapper;

		if ($hardDelete) {
			$this->roles()->detach();

			// remove all user activities
			$classMapper->staticMethod('activity', 'where', 'user_id', $this->id)->delete();

			// remove all user token password_reset, verification

			return $result = parent::forceDelete();
		}

		// Soft delete the user, leaving all associated records alone
		return parent::delete();
	}


	/** 
	 * Return a cache instance specific to user
	 *
	 * @return Iluminate\Contracts\Cache\Store
	 */
	public function getCache()
	{
		return static::$container->cache->tags([static::$container->config['cache.prefix'], '_u'.$this->id]);
	}


	/** 
	 * Retrieve the cached permission dictionary for this user
	 *
	 * @return array
	 */
	public function getCachedPermission()
	{
		if (!isset($this->cachedPermissions)) {
			$this->reloadCachedPermissions();
		}

		return $this->cachedPermissions;
	}

	/**
	 * Retrieve the cached permission dictionary for the user.
	 *
	 * @return User
	 *
	 */
	public function reloadCachedPermissions()
	{
		$this->cachedPermissions = $this->buildPermissionDictionary();
		return $this;
	}


	/** 
	 * Get the amount of time, in seconds, that has elapsed since the last activity of a certain time for this user.
	 *
	 * @param string 	$type 	 The type of activity to search for.
	 * @return int
	 */
	public function getSecondsSinceLastActivity($type)
	{
		$time = $this->lastActivityTime($type);
		$time = $time ? $time : '0000-00-00 00:00:00';
		$time = new Carbon($time);

		return $time->diffInSeconds();
	}



	/**
	 * Return whether or not this user is the admin user
	 *
	 * @return bool
	 */
	public function isAdmin()
	{
		return $this->rank === 'A';
	}


	/**
	 * Get the most recent activity for the user, based on user's last_access_id
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
	 */
	public function lastActivity()
	{
		$classMapper = static::$container->classMapper;

		return $this->belongsTo($classMapper->getClassMapper( 'activity'), 'last_access_id');
	}

	/**
	 * Find the most recent activity for this user of a particular type
	 *
	 * @param string 	$type 
	 * @return \Illuminate\Database\Eloquent\Builder
	 */
	public function lastActivityOfType($type = null)
	{
		$classMapper = static::$container->classMapper;

		$query = $this->hasOne($classMapper->getClassMapper('activity'), 'gruop_id');

		if ($type) {
			$query = $query->where('type', $type);
		}

		return $query->latest('occurred_at');
	}

	/**
	 * Get the most recent time for a specified activity type for this user.
	 * @param string 		$type
	 * @param string|null 	The last activity time, as a SQL formatted time (YYYY-MM-DD HH:MM:SS), or null if an activity of this type doesn't exist
	 */
	public function lastActivityTime($type)
	{
		$result = $this->activities()->where('type', $type)->max('occurred_at');

		return $result ? $result : null;
	}


	/**
	 * Performs tasks to be done after this user has been logout.
	 *
	 * By default, adds a new sign-out activity.
	 * @param mixed[] 	$params 	Optional array of parameters used for this event handler.
	 * @todo Transition to Laravel Event dispatcher to handle this
	 */
	public function onLogout($params = [])
	{
		static::$container->userActivityLogger->info("User {$this->username} signed out.", ['type' => 'sign_out']);
		
		return $this;
	}

	/**
	 * Determine if the property for the object exists
	 *
	 * We add relations here so that twig will able to find them
	 * @link http://stackoverflow.com/questions/29514081/cannot-access-eloquent-attributes-on-twig/35908957#35908957
	 * @param string $name 	The name of the property to check.
	 * @param bool true if the property is defined, false otherwise.
	 */
	public function __isset($name)
	{
		if (in_array($name, ['avatar', 'last_sign_in_time'])) {
			return true;
		}

		return parent::__isset($name);
	}


	/**
	 * Get a property for this object.
	 *
	 * @param string $name 	The name of property to retrieve
	 * @throws Exception 	The property does not exist for this object.
	 * @return string 		The associated property.
	 */
	public function __get($name)
	{
		if ($name === 'last_sign_in_time') {
			return $this->lastActivityTime('sign_in');
		} elseif ($name === 'avatar') {
			$hash = md5(strtolower(trim($this->email)));

			return 'https://www.gravatar.com/avatar/' . $hash . '?d=mm';
		} else {
			return parent::__get($name);
		}

	}	


}


