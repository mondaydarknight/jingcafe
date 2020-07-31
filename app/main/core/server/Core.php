<?php

namespace JingCafe\Core;

use JingCafe\MainDomain;
use JingCafe\Core\Database\Models\Model;
use JingCafe\Core\Middleware\IpAddress;
use RocketTheme\Toolbox\Event\Event;

class Core extends MainDomain {

	/**
	 * Intialize the app configuration
	 */
	public function onAppInitialization()
	{
		Model::$container = $this->container;
	}

	/**
	 * Register the shutdownHandler
	 * 
	 * @todo This needs to be constructed explicitly because it's invoked natively by PHP
	 */
	public function onMainDomainRegisterServices()
	{
		// Setup the global php settings from the cconfig service.
		$config = $this->container->config;

		// Display PHP fatal errors natively
		// if (isset($config['php.display_errors_native'])) {
		// 	ini_set('display_errors', $config['php.display_errors_native']);
		// }

		// Configure error report level
		// if (isset($config['php.error_reporting'])) {
		// 	error_reporting($config['php.error_reporting()']);
		// }

		// Log PHP fatal error
		if (isset($config['php.log_errors'])) {
			ini_set('log_errors', $config['php.log_errors']);
		}

		// Configure time zone
		if (isset($config['php.timezone'])) {
			date_default_timezone_set($config['php.timezone']);
		}

		// Determine if error display is enabled in the shutdown handler.
		$displayError = false;
		if (in_array(strtolower($config['php.display_errors']), ['1', 'on', 'true', 'yes'])) {
			$displayError = true;
		}

		
		
	}

	/**
	 * Initialize the instance of middleware
	 *
	 * @todo Verify CSRF TOKEN
	 * @todo Go through the blacklist and determine if the path and method match any of the blacklist entries.
	 */
	public function onGlobalMiddleware(Event $event) 
	{
		$app = $event->getApp();
		
		$this->injectIpAddressMiddleware($app);
		$this->injectHeaderConfigureMiddleware($app);
		
		// $this->container['app']->add('errorHandler')
		$request = $this->container->request;
		$path = $request->getUri()->getPath();
		$method = $request->getMethod();

		// Normalize the path always have the leading slash.
		$path = '/' . ltrim($path, '/');

		$csrfBlacklist = $this->container->config['csrf.blacklist'];
		$isBlacklist = false;
		
		foreach ($csrfBlacklist as $pattern => $methods) {
			$methods = array_map('strtoupper', $methods);

			if (in_array($method, $methods) && $pattern !== '' && preg_match('~'. $pattern .'~', $path)) {
				$isBlacklist = true;
				break;
			}
		}

		if (!$path || !$isBlacklist) {
			$app->add($this->container->csrf);
		}
		
	}

	protected function injectIpAddressMiddleware($app)
	{
		return $app->add(new IpAddress(true, []));
	}

	protected function injectHeaderConfigureMiddleware($app)
	{
		$headerConfigurationProcess = function($request, $response, $next) {
			$response = $next($request, $response);
			
			return $response
				->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
				->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');	
		};

		$app->add($headerConfigurationProcess);
	}

}












