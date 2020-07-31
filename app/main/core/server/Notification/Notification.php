<?php

namespace JingCafe\Core\Notification;

abstract class Notification
{

	/**
	 *
	 * @var array
	 */
	protected $config;
	
	/**
	 * Constructor
	 * @param 
	 */
	public function __construct(array $config = [])
	{
		$this->config = $config;
	}

	protected function generateIcon()
	{
		return static::ICON;
	}

	protected function generateTitle()
	{
		return static::TITLE;
	}

	
}