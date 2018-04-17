<?php

namespace JingCafe;

define('JingCafe\VERSION', '2.0.0');
define('JingCafe\PHP_MIN_VERSION', '5.6');

define('JingCafe\NAME', 'JingCafe');
define('JingCafe\ROOT_DIR', realpath(__DIR__ . '/..'));

if (!defined('JingCafe\APP_DIR')) {
	define('JingCafe\APP_DIR', str_replace(DIRECTORY_SEPARATOR, '/', __DIR__));
}

define('JingCafe\APP_DIR_NAME', basename(__DIR__));

define('JingCafe\MAIN_DIR_NAME', 'main');
define('JingCafe\BUILD_DIR_NAME', 'build');
define('JingCafe\CACHE_DIR_NAME', 'cache');
define('JingCafe\DB_DIR_NAME', 'database');
define('JingCafe\SESSION_DIR_NAME', 'session');
define('JingCafe\LOG_DIR_NAME', 'logs');
define('JingCafe\VENDOR_DIR_NAME', '../vendor');



define('JingCafe\ASSET_DIR_NAME', 'assets');
define('JingCafe\EXTRA_DIR_NAME', 'extra');
define('JingCafe\CONFIG_DIR_NAME', 'config');
define('JingCafe\LOCALE_DIR_NAME', 'locale');
define('JingCafe\ROUTE_DIR_NAME', 'routes');
define('JingCafe\SCHEMA_DIR_NAME', 'schema');
define('JingCafe\TEMPLATE_DIR_NAME', 'templates');
define('JingCafe\FACTORY_DIR_NAME', 'factories');
