<?php



namespace JingCafe;

use Interop\Container\ContainerInterface;
use RocketTheme\Toolbox\Event\EventSubscriberInterface;

/**
 * Represents a main domain (plugin, theme, site, etc), and code required boot up
 */
class MainDomain implements EventSubscriberInterface {

	/**
	 * @var ContainerInterface
	 */
	protected $container;


	/**
	 * By default assign all methods as listeners using the default priority
	 *
	 */
	public static function getSubscribedEvents()
	{
		$methods = get_class_methods(get_called_class());

		$list = [];
		foreach ($methods as $method) {
			if (strpos($method, 'on') === 0) {
				$list[$method] = [$method, 0];
			}
		}

		return $list;
	}

	/**
	 * Initialize default constructor
	 * @param ContainerInterface
	 */
	public function __construct(ContainerInterface $container)
	{
		$this->container = $container;
	}

}