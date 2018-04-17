<?php




namespace JingCafe\Core\Controller;


use Interop\Container\ContainerInterface;

abstract class Controller 
{
	/**
	 * Constructor
	 * @var ContainerInterface	Global container object with all services.
	 */
	protected $container;

	/**
	 * @param ContainerInterface
	 */
	public function __construct(ContainerInterface $container)
	{
		$this->container = $container;
	}


}