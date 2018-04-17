<?php

/**
 * Core configuration file
 *
 * Sensitive credentials should be stored in an environment variable or your .env file
 * Database password: 
 * SMTP server password:
 */

return [
	'alert' => [],
	'assets' => [
		'raw' => [
			'path'		=> 'assets',
			'schema'	=> 'asset-bundles.json'
		],
		'paths' => realpath(\JingCafe\APP_DIR)
	],
	'cache'	=> [
		'driver' 	=> 'file',
		'prefix'	=> 'JingCafe',
		'memcached'	=> [
			'host'		=> '127.0.0.1',
			'port'		=> 11211,
			'weight'	=> 100
		],
		'redis' => [
			'host'		=> '127.0.0.1',
			'password'	=> null,
			'port'		=> 6379,
			'database'	=> 0
		],
		'twig' => false
	],
	'csrf' => [
		'name'				=> 'csrf',
		'storage_limit' 	=> 200,
		'strength'			=> 16,
		'persistent_token' 	=> true,
		// A list of url paths to ignore CSRF Checks on
		'bloacklist'		=> [
			// URL paths will be match against each regular expression in this list.
		]
	],
	'db' => [
		'default' => [
			'driver'	=> getenv('DB_DRIVER') ?: 'mysql',
			'host'		=> getenv('DB_HOST') ?: null,
			'port'		=> getenv('DB_PORT') ?: null,
			'database'	=> getenv('DB_NAME') ?: null,
			'username'	=> getenv('DB_USERNAME') ?: null,
			'password'	=> getenv('DB_PASSWORD') ?: null,
			'charset'	=> 'utf8',
			'collation'	=> 'utf8_unicode_ci',
			'prefix'	=> '',
			'schema'	=> 'public',
			'sslmode'	=> 'prefer'
		]		
	],
	'debug'	=> [
		'queries'	=> true,
		'smtp'		=> false,
		'twig'		=> false
	],
	'mail' => [
		// Set to one of smtp, mail, qmail, sendmail
		'mailer'	=> 'smtp',
		'service'	=> \JingCafe\NAME,
		'host'		=> getenv('SMTP_HOST') ?: null,
		'port'		=> 587,
		'auth'		=> true,
		'secure'	=> 'tls',
		'username'	=> getenv('SMTP_USERNAME') ?: null,
		'password'	=> getenv('SMTP_PASSWORD') ?: null,
		'debug'		=> 4
	],
	'path' => [
		'document_root' 	=> str_replace(DIRECTORY_SEPARATOR, '/', $_SERVER['DOCUMENT_ROOT']),
		'public_relative'	=> dirname($_SERVER['SCRIPT_NAME'])
	],
	'session' => [
		'name'			=> \JingCafe\NAME . 'Client',
		'minutes'		=> 120,
		'cache_limiter'	=> false,
		// Decouples the session keys used to store certain session info
		'keys' 			=> [
			'csrf' 				=> 'site.csrf',
			'current_user_id' 	=> 'account_user_id'
		],
		'handler'		=> 'file',
		// Config values for when using db-based session
		'database'		=> [
			'table' => 'sessions'
		]		
	],
	'settings' => [
		'displayErrorDetails' => true
	],
	'site' => [
		'csrf' => null,
		'locales' => [
			'available' => [
				'en_US' => 'English',
				'zh_TW'	=> '中文'
			],
			'default' => 'zh_TW'
		],
		'title' => 'JingCafe',
		'uri' => [
			'base' => [
				'host'		=> isset($_SERVER['SERVER_NAME']) ? trim($_SERVER['SERVER_NAME'], '/') : 'localhost',
				'scheme'	=> empty($_SERVER['HTTPS']) || $_SERVER['HTTTPS'] === 'off' ? 'http' : 'https',
				'port'		=> isset($_SERVER['SERVER_PORT']) ? (int)$_SERVER['SERVER_PORT'] : null,
				'path'		=> isset($_SERVER['SCRIPT_NAME']) ? trim(dirname($_SERVER['SCRIPT_NAME']), '/\\') : '' 
			]
		]
	],
	'persistence' => [
		'cookie' => [
			'name' 			=> 'rememberme',
			'expire_time' 	=> 86400,
			'path' => '/'
		],
		'table' => [
			'tableName'				=> 'persistences',
			'credentialColumn'		=> 'user_id',
			'tokenColumn'			=> 'token',
			'persistentTokenColumn'	=> 'persistence_token',
			'expiresColumn'			=> 'expired_at'
		]
	]
];









