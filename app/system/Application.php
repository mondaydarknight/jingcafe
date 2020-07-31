<?php

/**
 * Server environment application.
 * 
 *
 *
 *
 * @author Mong Cheng
 */

namespace JingCafe;

use RocketTheme\Toolbox\Event\EventDispatcher;
use RocketTheme\Toolbox\Event\Event;
use Slim\App;
use Slim\Container;
// use JingCafe\Facade;


class Application {

	/**
	 * @var Container The global container object
	 */
	protected $container;

	/**
	 * @var The application of Slim
	 */
	protected $app;


	public function __construct()
	{
		$this->container = new Container;
		// Facade::setFacadeContainer($this->container);
		
	}

	/**
	 * Dispatch an event with optional parameters
	 *
	 * @param string $eventName
	 * @param string @event
	 * @return Event
	 */
	public function dispatchEvent($eventName, Event $event = null)
	{
		return $this->container->eventDispatcher->dispatch($eventName, $event);
	}

	/**
	 * Return the underlying Slim App instance 
	 * @return object
	 */
	public function getApp()
	{
		return $this->app;
	}

	/**
	 * Return the DI container
	 * @return object
	 */
	public function getContainer()
	{
		return $this->container;
	}

	/**
	 * Include all defiend routes in route stream
	 *
	 * Include them in reverse order to allow higher priority routes to override lower priority.
	 */	
	public function loadRoutes()
	{
		// Since routes aren't encapsulated in a class yet, we need global workaround
		global $app;
		$app = $this->app;

		$routePaths = $this->container->locator->findResources('routes://', true, true);

		foreach ($routePaths as $path) {
			$roruteFiles = glob($path . '/*.php');

			foreach ($roruteFiles as $file) {
				require_once $file;
			}
		}
	}

	public function run()
	{	
		$this->setupConfiguration();

		$this->app = new App($this->container);

		$this->container->settings = $this->container->config['settings'];

		$appEvent = new AppEvent($this->app);

		$this->dispatchEvent('onAppInitialization', $appEvent);

		$this->loadRoutes();

		$this->dispatchEvent('onGlobalMiddleware', $appEvent);
		
		$this->app->run();
	}

	public function setupConfiguration($isWeb = true)
	{
		$serviceProvider = new ServiceProvider;
		$serviceProvider->register($this->container);

		$schemaPath = \JingCafe\APP_DIR . '/config.json';
	
		$mainDomainManager = $this->container->mainDomainManager;
		
		try {
			$mainDomainManager->initLoadSchema($schemaPath);
		} catch (FileNotFoundException $e) {
			if ($isWeb) {
				$this->renderJingCafeErrorPage($e->getMessage());
			} else {
				$this->renderJingCafeErrorCli($e->getMessage());
			}
		}
		
		$this->dispatchEvent('onMainDomainInitialized');

		// Add MainDomain resources (assets, templates, etc)
		$mainDomainManager->addResources();
		$this->dispatchEvent('onMainDomainAddResources');

		$mainDomainManager->registerAllServices();
		$this->dispatchEvent('onMainDomainRegisterServices');
	}

	


	/**
	 * Render a basic error pagee for problems with load MainDomains
	 */
	protected function renderJingCafeErrorPage($errorMessage)
	{
		ob_clean();

		$title = 'JingCafe Application Error';
		$errorMessage = "Unable to start site. Contact owner.<br/><br/>" .
            "Version: UserFrosting ".\JingCafe\VERSION."<br/>" . $errorMessage;
        $output = sprintf("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>" .
            "<title>%s</title><style>body{margin:0;padding:30px;font:12px/1.5 Helvetica,Arial,Verdana," .
            "sans-serif;}h1{margin:0;font-size:48px;font-weight:normal;line-height:48px;}strong{" .
            "display:inline-block;width:65px;}</style></head><body><h1>%s</h1>%s</body></html>",
        	$title,
        	$title,
        	$errorMessage
        );

        exit($output);
	}

	protected function renderJingCafeErrorCli($errorMessage = '')
	{
		exit($errorMessage . PHP_EOL);
	}

	/**
	 * @deprecated
	protected function initServerEnvironment()
	{
		if (isset($_SERVER['HTTP_ORIGINN'])) {
			header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
			header('Access-Control-Allow-Credentials: true');
			header('Access-Control-Max-Age: 86400');
		}

		if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	   	 	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
	   	 		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");	
	   	 	}
	        
		    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {		    	
		        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
		    }

		}
	}
	*/
}







