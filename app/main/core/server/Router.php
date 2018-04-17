<?php


namespace JingCafe\Core;

use Illuminate\Filesystem\Filesystem;
use InvalidArgumentException;
use RuntimeException;
use Slim\Router as SlimRouter;
use Slim\Route;
use Slim\Interfaces\RouteGroupInterface;
use Slim\Interfaces\RouterInterface;

/**
 * Router
 * 
 * This class extends Slim's router, to permit overriding of routes with the same signature.
 * @author Mong
 */
class Router extends SlimRouter implements RouterInterface {

	/**
	 * @var string[] a reverse lookup of route identifiers, indexed by route signiture.
	 */
	protected $identifiers;


	/**
	 * Add route
	 *
	 * @param string[] 	$methods 	Array of HTTP methods
	 * @param string 	$pattern 	The route pattern
	 * @param callable 	$handler 	The route callable
	 *
	 * @throws InvalidArgumentException if the route pattern isn't a string.
	 * @return RouteInterface
	 */
	public function map($methods, $pattern, $handler)
	{
		if (!is_string($pattern)) {
			throw new InvalidArgumentException('Route pattern must be a string');
		}

		// Prepend parent group pattern(s)
		if ($this->routeGroups) {
			$pattern = $this->processGroups() . $pattern;
		}

		// According to RFC methods are defined in uppercase (See RPC 7231)
		$methods = array_map("strtoupper", $methods);

		// Determine route signature
		$signature = implode('-', $methods) . '-' . $pattern;

		if (isset($this->identifiers[$signature])) {
			$route = new Route($methods, $pattern, $handler, $this->routeGroups, str_replace('route', '', $this->identifiers[$signature]));
		} else {
			$route = new Route($methods, $pattern, $handler, $this->routeGroups, $this->routeCounter);
		}

		$this->routes[$route->getIdentifier()] = $route;

		// Record identifier in reverse lookup array
		$this->identifiers[$signature] = $route->getIdentifier();

		$this->routeCounter++;

		return $route;
	}

	/**
	 * Delete the cache file
	 *
	 * @access public 
	 * @return bool 	if operation is successful
	 */
	public function clearCache()
	{
		$fileSystem = new Filesystem;

		if ($fileSystem->exists($this->cacheFile)) {
			return $fileSystem->delete($this->cacheFile);
		}

		return true;
	}

}
