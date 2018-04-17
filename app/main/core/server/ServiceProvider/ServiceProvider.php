<?php

/**
 * UserFrosting (http://www.userfrosting.com)
 *
 * @link      https://github.com/userfrosting/UserFrosting
 * @license   https://github.com/userfrosting/UserFrosting/blob/master/licenses/UserFrosting.md (MIT License)
 */

namespace JingCafe\Core\ServiceProvider;

use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Events\Dispatcher;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Session\DatabaseSessionHandler;
use Illuminate\Session\FileSessionHandler;
use Interop\Container\ContainerInterface;
use JingCafe\Core\Router;
use JingCafe\Core\Log\MixedFormatter;
use JingCafe\Core\Session\Session;
use JingCafe\Core\Authentication\Authenticator;
use JingCafe\Core\Util\ClassMapper;
use JingCafe\Core\Util\Repository;
use League\FactoryMuffin\FactoryMuffin;
use League\FactoryMuffin\Faker\Facade as Faker;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\ErrorLogHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Slim\Csrf\Guard;
use Slim\Http\Uri;
use Slim\Views\Twig;
use Slim\Views\TwigExtension;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\NullSessionHandler;
use UserFrosting\Assets\AssetBundleSchema;
use UserFrosting\Assets\AssetLoader;
use UserFrosting\Assets\AssetManager;
use UserFrosting\Assets\UrlBuilder\AssetUrlBuilder;
use UserFrosting\Assets\UrlBuilder\CompiledAssetUrlBuilder;
use UserFrosting\Cache\TaggableFileStore;
use UserFrosting\Cache\MemcachedStore;
use UserFrosting\Cache\RedisStore;
use UserFrosting\Config\ConfigPathBuilder;
use UserFrosting\I18n\LocalePathBuilder;
use UserFrosting\I18n\MessageTranslator;
use UserFrosting\Sprinkle\Core\Error\ExceptionHandlerManager;
use UserFrosting\Sprinkle\Core\Error\Handler\NotFoundExceptionHandler;
use UserFrosting\Sprinkle\Core\Mail\Mailer;
use UserFrosting\Sprinkle\Core\Alert\CacheAlertStream;
use UserFrosting\Sprinkle\Core\Alert\SessionAlertStream;
use UserFrosting\Sprinkle\Core\Throttle\Throttler;
use UserFrosting\Sprinkle\Core\Throttle\ThrottleRule;
use UserFrosting\Sprinkle\Core\Twig\CoreExtension;
use UserFrosting\Sprinkle\Core\Util\CheckEnvironment;
use UserFrosting\Support\Exception\BadRequestException;
use UserFrosting\Support\Exception\NotFoundException;
use UserFrosting\Support\Repository\Loader\ArrayFileLoader;




class ServiceProvider {




	public function register(ContainerInterface $container)
	{

		$container['alert']	= function($c) {

		};

		$container['assets'] = function($c) {

		};

		$container['authenticator'] = function($c) {
			$classMapper = $c->classMapper;
			$config = $c->config;
			$session = $c->session;
			$cache = $c->cache;
			$environment = $c->environment;
			// Register database connection.
			$c->db;

			$authenticator = Authenticator::create($classMapper, $session, $config, $cache);

			/** 
			 * Set salt in authenticator storage
			 * Combine IPAddress and UserAgent
			 */
			$authenticator->setSalt($environment['REMOTE_ADDR'] . $environment['HTTP_USER_AGENT']);

			return $authenticator;
		};


		$container['cache'] = function($c) {
			$config = $c->config;

			if ($config['cache.driver'] === 'file') {
				$path = $c->locator->findResource('cache://', true, true);
				$cacheStore = new TaggableFileStore($path);
			} else if ($config['cache.driver'] === 'memcached') {
				$cacheStore = new MemcachedStore($config['cache.memcached']);
			} else if ($config['cache.driver'] === 'redis') {
				$cacheStore = new  RedisStore($config['cache.redis']);
			} else {
				throw new \Exception(sprintf('Bad cache type %s specified in configuration file.'), $config['cache.driver']);
			}

			$cache = $cacheStore->instance();
			return $cache->tags($config['cache.prefix']);
		};

		$container['classMapper'] = function($c) {
			$classMapper = new ClassMapper;

			$classMapper->setClassMapper('activity', 'JingCafe\Core\Database\Models\Activity');
			$classMapper->setClassMapper('category', 'JingCafe\Core\Database\Models\Category');
			$classMapper->setClassMapper('user', 'JingCafe\Core\Database\Models\User');
			$classMapper->setClassMapper('product', 'JingCafe\Core\Database\Models\Product');
			$classMapper->setClassMapper('shop', 'JingCafe\Core\Database\Models\Shop');

			return $classMapper;
		};

		$container['config'] = function($c) {
			try {
				$dotenv = new Dotenv(\JingCafe\APP_DIR);
				$dotenv->load();
			} catch (InvalidPathException $e) {
				// Skip loading the environment config file if it doesn't exist.
			}

			// Get configuration mode from environment
			$mode = getenv('UF_MODE') ? : '';
			
			// Construct and load config repository
			$builder = new ConfigPathBuilder($c->locator, 'config://');
			$loader = new ArrayFileLoader($builder->buildPaths($mode));
			$config = new Repository($loader->load());

			// Construct base uri from components, if not explicitly specified
			if (!isset($config['site.uri.public'])) {
				$baseUri = $config['site.uri.base'];

				$public = new Uri(
					$baseUri['scheme'], 
					$baseUri['host'], 
					$baseUri['port'], 
					$baseUri['path']
				);

				// Slim\Http\Uri lides to add trailing slashes when path is empty.	
				$config['site.uri.public'] = trim($public, '/');
			}

			/** 
			 * Hacky fix to prevent sessions from being hit too much. Ignore CSRF middleware for requests for raw assets ;-)
			 *
			 * See https://github.com/laravel/framework/issues/8172#issuecomment-99112012 for more information 
			 *	on why it's bad to hit Laravel sessions multiple times in rapid succession.
			 */
			$csrfBlacklist = $config['csrf.blacklist'];
			$csrfBlacklist['^/' . $config['assets.raw.path']] = ['GET'];
			$config->set('csrf.blacklist', $csrfBlacklist);

			return $config;
		};

		$container['csrf'] = function($c) {

		};

		/**
		 * Initialize Eloquent Capsule, which provide the databaes layer of UF
		 *
		 * @todo consturct the individual objects rather than using the facade.
		 */
		$container['db'] = function($c) {
			$config = $c->config;

			$capsule = new Capsule;

			foreach ($config['db'] as $name => $dbConfig) {
				$capsule->addConnection($dbConfig, $name);
			}

			$queryEventDispatcher = new Dispatcher(new Container);

			$capsule->setEventDispatcher($queryEventDispatcher);

			// Register as global connection.
			$capsule->setAsGlobal();

			// Start Eloquent 
			$capsule->bootEloquent();

			if ($config['debug.queries']) {
				$logger = $c->queryLogger;

				foreach ($config['db'] as $databaseName => $dbConfig) {
					$capsule->connection($databaseName)->enableQueryLog();
				}

				// Register listener 
				$queryEventDispatcher->listen(QueryExecuted::class, function($query) use ($logger) {
					$logger->debug('Query executed on database [{$query->connectionName}]:', [
						'query'		=> $query->sql,
						'bindings'	=> $query->bindings,
						'time'		=> $query->time . ' ms'
					]);
				});
 			}

			return $capsule;
		};

		$container['mailer'] = function($c) {

		};

		/**
		 * Laravel query logging with Monolog
		 *
		 * Extend this service to puush additional handlers into the query log stack.
		 */
		$container['queryLogger'] = function($c) {
			$logger = new Logger('query');

			$logFile = $c->locator->findResource('log://jingcafe.log', true, true);

			$handler = new StreamHandler($logFile);

			$formatter = new MixedFormatter(null, null, true);

			$handler->setFormatter($formatter);
			$logger->pushHandler($handler);

			return $logger;
		};

	
		$container['router'] = function($c) {
			$routerCacheFile = false;

			if (isset($c->config['settings.routerCacheFile'])) {
				$routerCacheFile = $c->config['settings.routerCacheFile'];
			}

			return (new Router)->setCacheFile($routerCacheFile);
		};
 	
		/**
		 * Start PHP session with the name and parameters specified in configuration file.
		 */
		$container['session'] = function($c) {
			$config = $c->config;

			if ($config['session.handler'] === 'file') {
				$fileSystem = new Filesystem;
				$handler = new FileSessionHandler($fileSystem, $c->locator->findResource('session://'), $config['session.minutes']);
			} elseif ($config['session.handler'] === 'database') {
				$connection = $c->db->connection();
				// Table must exist otherwise an exception will be thrown
				$hanlder = new DatabaseSessionHanlder($connection, $config['session.database.table'], $config['session.minutes']);
			} else {
				throw new \Exception("Bad session handler type {$config['session.handler']} specified in configuration file.");
			}

			$session = new Session($handler, $config['session']);
			$session->start();

			return $session;
		};

		/**
		 * Set up Twig as the view, adding template paths for all main domains and slim extension
		 *
		 * Also adds the Core Twig extension, provides additional functions,
		 * filters, global varialbes, etc
		 */
		$container['view'] = function($c) {
			$templatePaths = $c->locator->findResource('templates://', true, true);

			$view = new Twig($templatePaths);
			$loader = $view->getLoader();
			
			// $mainDomains = $c->mainDomainManager->getMainDomainNames();
			
			// // Add MainDomains templates namespaces 			
			// foreach ($mainDomains as $mainDomain) {
			// 	$path = \JingCafe\APP_DIR . DIRECTORY_SEPARATOR . \JingCafe\MAIN_DIR_NAME . DIRECTORY_SEPARATOR . $mainDomain . DIRECTORY_SEPARATOR . \JingCafe\TEMPLATE_DIR_NAME . DIRECTORY_SEPARATOR;

			// 	if (is_dir($path)) {
			// 		$loader->addPath($path, $mainDomain);
			// 	}
			// }

			// $twig = $view->getEnvironment();

			// if ($c->config['cache.twig']) {
			// 	$twig->setCache($c->locator->findResource('cache://twig', true, true));
			// }

			// if ($c->config['debug.twig']) {
			// 	$twig->enableDebug();
			// 	$view->addExtension(new \Twig_Extension_Debug());
			// }

			$slimExtension = new TwigExtension($c->router, $c->request->getUri());

			$view->addExtension($slimExtension);

			// Register the core UF extension whti Twig
			// $coreExtension = new CoreExtension($c);
			// $view->addExtension($coreExtension);
			return $view;
		};

	}




}




