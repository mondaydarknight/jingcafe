<?php

namespace JingCafe\Core\Notification;

use InvalidArgumentException;

class NotificationManager
{
	/**
	 * @var this
	 */
	private static $instance;

	/**
	 * Configuration
	 * @var array[mixed] 
	 */
	protected $config;

	/**
	 * @var array
	 */
	protected $stores = [];

	public function __construct(array $config)
	{
		$this->config = $config;
	}

	/**
	 *
	 * @param string
	 */
	public static function create(array $config)
	{
		if (!static::$instance) {
			static::$instance = new static($config);
		}

		return static::$instance->access();
	}

	/**
	 *
	 * @param string $type
	 * 
	 */
	public function access()
	{	
		$config = $this->config;

		if (!isset($this->config['type'])) {
			throw new InvalidArgumentException("Undefined type in notification.");	
		}
  		
		if (isset($this->stores[$config['type']])) {
			return $this->stores[$config['type']];
		}

		$createMethod = 'create'. lcfirst($config['type']).'Notification';

		if (!method_exists($this, $createMethod)) {
			throw new InvalidArgumentException('Undefiend method of creating notification');
		}

		return $this->stores[$config['type']] = $this->{$createMethod}();
	}

	public function extend()
	{

	}


	protected function createActivityNotification()
	{
		return new ActivityNotification($this->config);
	}

	protected function createPaymentNotification()
	{
		return new PaymentNotification($this->config);
	}

	protected function createDiscountNotification()
	{
		return new DiscountNotification($this->config);
	}

	/**
	 *
	public function __call($method, $arguments)
	{

	}
	*/


}
