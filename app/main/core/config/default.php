<?php

/**
 * Core configuration file
 *
 * Sensitive credentials should be stored in an environment variable or your .env file
 * Database password: 
 * SMTP server password:
 */

return [
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

	'file' => [
		'name' 			=> null,
		'maxSize' 		=> null,
		'fileMaxSize' 	=> null,
		'extenssions' 	=> null,
		'required'		=> null,
		// 'uploadDir'		=> '/assets/img/',
		'title'			=> ['{random}{date}', 32],
		'replace'		=> true,
		'listInput'		=> true,
		'files'			=> null
	],
	'mail' => [
		// Set to one of smtp, mail, qmail, sendmail
		'admin' => [
			'email' => getenv('SMTP_USERNAME'),
			'name'	=> \JingCafe\NAME
		],
		'mailer'	=> 'smtp',
		'service'	=> \JingCafe\NAME,
		'host'		=> getenv('SMTP_HOST') ?: null,
		'port'		=> 587,
		'auth'		=> true,
		'secure'	=> 'tls',
		'username'	=> getenv('SMTP_USERNAME') ?: null,
		'password'	=> getenv('SMTP_PASSWORD') ?: null,
		'debug'		=> 4,
		'options'	=> [
			'isHtml'	=> true,
			'CharSet' 	=> 'UTF-8',
			'Timeout'	=> 15
		],
		'certificate' => [
			'ssl' => [
				'verify_peer' 		=> false,
				'verify_peer_name'	=> false,
				'allow_self_signed'	=>  true
			]
		]
	],
	'path' => [
		'document_root' 	=> str_replace(DIRECTORY_SEPARATOR, '/', $_SERVER['DOCUMENT_ROOT']),
		'public_relative'	=> dirname($_SERVER['SCRIPT_NAME']),
		'assets'			=> [
			'icon'			=> \JingCafe\PUBLIC_PATH . '/assets/img/icon',
			'product'		=> '/assets/img/products/'
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
		'charset' => 'UTF-8',
		'locales' => [
			'available' => [
				'en_US' => 'English',
				'zh_TW'	=> '中文'
			],
			'default' => 'zh_TW'
		],
		'title' => \JingCafe\NAME,
		'uri' => [
			'base' => [
				'host'		=> isset($_SERVER['SERVER_NAME']) ? trim($_SERVER['SERVER_NAME'], '/') : 'localhost',
				'scheme'	=> empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off' ? 'http' : 'https',
				'port'		=> isset($_SERVER['SERVER_PORT']) ? (int)$_SERVER['SERVER_PORT'] : null,
				'path'		=> isset($_SERVER['SCRIPT_NAME']) ? trim(dirname($_SERVER['SCRIPT_NAME']), '/\\') : '' 
			]
		]
	],
	'system' => [
		'checkout' => [
			'continue_day' => 5,			
		],
		'notification' => [
			'continue_day' 	=> 3
		]
	],
	'verification' => [
		'algorithm'	=> 'sha512',
		'timeout'	=> 10800,
		'key'		=> '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'
	],
	'php' => [
		'timezone' 				=> 'Asia/Taipei',
		'error_reporting' 		=> E_ALL,
		'display_errors'		=> 'true',
		'log_errors'			=> 'false',
		// Let PHP itself render errors natively, Useful if a fatal error is rasied in our custom shutdown handler
		'display_errors_native'	=> 'false'
	]
];









