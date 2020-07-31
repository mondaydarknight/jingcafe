<?php

namespace JingCafe;


use Interop\Container\ContainerInterface;
use RocketTheme\Toolbox\Event\EventDispatcher;
use RocketTheme\Toolbox\ResourceLocator\UniformResourceLocator;
use RocketTheme\Toolbox\StreamWrapper\ReadOnlyStream;
use RocketTheme\Toolbox\StreamWrapper\StreamBuilder;



class ServiceProvider {


	public function register(ContainerInterface $container) 
	{
		/**
		 * Set up the event dispatcher, required by Application to hook into lifestyle.
		 */
		$container['eventDispatcher'] = function($c) {
			return new EventDispatcher;
		};

		$container['locator'] = function($c) {
			$locator = new UniformResourceLocator(\JingCafe\ROOT_DIR);
		
			$locator->addPath('build', '', \JingCafe\BUILD_DIR_NAME);
			$locator->addPath('log', '', \JingCafe\APP_DIR_NAME .DIRECTORY_SEPARATOR. \JingCafe\LOG_DIR_NAME);
			$locator->addPath('cache', '', \JingCafe\APP_DIR_NAME .DIRECTORY_SEPARATOR. \JingCafe\CACHE_DIR_NAME);
			$locator->addPath('session', '', \JingCafe\APP_DIR_NAME .DIRECTORY_SEPARATOR. \JingCafe\SESSION_DIR_NAME);

			ReadOnlyStream::setLocator($locator);

			$c->streamBuilder;

			return $locator;
		};

		$container['streamBuilder'] = function($c) {
			$streams = [
				'main'		=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
				'assets'	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
				'build' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\Stream',
                'log' 		=> '\\RocketTheme\\Toolbox\\StreamWrapper\\Stream',
                'cache' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\Stream',
                'session' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\Stream',
                'assets' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                'schema' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                'templates' => '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                'extra' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                'locale' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                'config' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                'routes' 	=> '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream',
                // 'factories' => '\\RocketTheme\\Toolbox\\StreamWrapper\\ReadOnlyStream'
			];

			foreach ($streams as $scheme => $stream) {
				if (in_array($scheme, stream_get_wrappers())) {
					stream_wrapper_unregister($scheme);
				}
			}

			$streamBuilder = new StreamBuilder($streams);

			return $streamBuilder;
		};

		$container['mainDomainManager'] = function($c) {
			return new MainDomainManager($c);
		};

	}



}

