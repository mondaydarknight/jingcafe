<?php

/**
 * JingCafe ()
 *
 * @link 
 * @license 
 */
namespace JingCafe;

use RocketTheme\Toolbox\Event\Event;
use Slim\App;

class AppEvent extends Event 
{
	/**
	 *  Used for events that need to access Slim application.
	 */
	protected $app;

	public function __construct(App $app)
	{
		$this->app = $app;
	}


	public function getApp()
	{
		return $this->app;
	}

}
