<?php

namespace JingCafe\Core\Twig;

use Twig_Extension;
use Twig_Extension_GlobalsInterface;
use Interop\Container\ContainerInterface;

/**
 * Class CoreExtension  
 * Extends Twig funcitonality for the core extension.
 */
class CoreExtension extends Twig_Extension implements Twig_Extension_GlobalsInterface {

	/**
	 * @var ContainerInterface	The object of global container services.
	 */
	protected $container;

	/** 
	 * Constructor
	 * 
	 * @param ContainerInterface 
	 */
	public function __construct(ContainerInterface $container)
	{
		$this->container = $container;
	}

	/**
	 * Get the name of this extension
	 *
	 * @return string
	 */	
	public function getName()
	{
		return 'jingcafe/core';
	}

	/**
	 * Get global extension
	 *
	 * @todo Get CSRF token
	 * @return array[mixed]
	 */
	public function getGlobals()
	{
		$config = $this->container->config;
		$csrf = $this->container->csrf;

		$csrfToken = [
			'csrf' => [
				'keys' => [
					'name' => $csrf->getTokenNameKey(),
					'value'=> $csrf->getTokenValueKey()
				],
				'name' => $csrf->getTokenName(),
				'value'=> $csrf->getTokenValue()
			]
		];
		
		$site = array_replace_recursive($config['site'], $csrfToken);
		
		return [
			'site' => $site
		];
	}

}
