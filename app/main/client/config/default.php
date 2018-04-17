<?php

return [

	'site' => [
		'login' => [
			'enable_email' => true
		],
		'registration' => [
			'enabled' => true,
			'captcha' => false,
			'require_email_verification' => true,
			'user_defaults' => [
				'locale' => 'zh_TW',
				'roles' => ['user' => true]
			]
		]
	]


];




