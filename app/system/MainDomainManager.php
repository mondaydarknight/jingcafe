<?php




namespace JingCafe;

use Illuminate\Support\Str;
use Interop\Container\ContainerInterface;


class MainDomainManager {

	/**
	 * @var ContainerInterface 
	 */
	protected $container;

	/**
	 * @var array
	 */
	protected $mainDomainCollections = [];

	/**
	 * The full absolute base path to the collection directory.
	 * @var string 
	 */
	protected $collectionPath;

	/**
	 * Keeps track of a mapping from resource stream names relative paths.
	 * @var array
	 */
	protected $resourcePaths;


	public function __construct(ContainerInterface $container)
	{
		$this->container = $container;

		$this->resourcePaths = [
			'assets'	=> DIRECTORY_SEPARATOR . \JingCafe\ASSET_DIR_NAME,
			'config'	=> DIRECTORY_SEPARATOR . \JingCafe\CONFIG_DIR_NAME,
			'extra'		=> DIRECTORY_SEPARATOR . \JingCafe\EXTRA_DIR_NAME,
			'factories'	=> DIRECTORY_SEPARATOR . \JingCafe\FACTORY_DIR_NAME,
			'locale'	=> DIRECTORY_SEPARATOR . \JingCafe\LOCALE_DIR_NAME,
			'schema'	=> DIRECTORY_SEPARATOR . \JingCafe\SCHEMA_DIR_NAME,
			'routes'	=> DIRECTORY_SEPARATOR . \JingCafe\ROUTE_DIR_NAME,
			'templates'	=> DIRECTORY_SEPARATOR . \JingCafe\TEMPLATE_DIR_NAME
		];

	}


	/**
	 * Adds the relative path for specified resource type in the MainDomain to the resource stream
	 *
	 * @param string $resourceName 
	 * @param string $mainDomainName
	 * @return string | bool The full path to specified resource for the specified MainDomain(if found)
	 */
	public function addResource($resourceName, $mainDomainName)
	{
		$fullPath = \JingCafe\APP_DIR .DIRECTORY_SEPARATOR . \JingCafe\MAIN_DIR_NAME .DIRECTORY_SEPARATOR . $mainDomainName . DIRECTORY_SEPARATOR . $resourceName;

		$this->container->locator->addPath($resourceName, '', $fullPath);

		return $this->container->locator->findResource("$resourceName://", true, false);

		/**
		 * This would allow a stream to subnavigate to specified mainDomain (ex: templates://core/)
		 * 
		 * $locator->addPath('templates', '$name', $mainDomainDirFragment . '/' . \JingCafe\TEMPLATE_DIR_NAME);
		 */
	}

	/**
	 * Register resource streams for all base domain
	 */
	public function addResources()
	{
		foreach ($this->mainDomainCollections as $mainDomainName => $mainDomain) {
			$this->addResource('assets', $mainDomainName);
			$this->addResource('config', $mainDomainName);
			$this->addResource('extra', $mainDomainName);
			$this->addResource('factories', $mainDomainName);
			$this->addResource('locale', $mainDomainName);
			$this->addResource('schema', $mainDomainName);
			$this->addResource('routes', $mainDomainName);
			$this->addResource('templates', $mainDomainName);
		}

	}




	/**
	 * Takes the name of a Sprinkle, and creates an instance of the initializer object (if defined).
     *
     * Creates an object of a subclass of UserFrosting\System\Sprinkle\Sprinkle if defined for the sprinkle (converting to StudlyCase).
     * Otherwise, returns null.
     * @param $name The name of the Sprinkle to initialize.
	 */
	public function bootMainDomainFile($name)
	{
		$className = Str::studly($name);
		$fullClassName = "\\JingCafe\\$className\\$className";

		if (class_exists($fullClassName)) {
			return new $fullClassName($this->container);
		} else {
			return null;
		}
	}



	public function getMainDomainNames()
	{
		return array_keys($this->mainDomainCollections);
	}

	public function isMainDomainExist($name)
	{
		return in_array($name, $this->getMainDomainNames());
	}

	/**
	 * Initialize a list of cllections, instantiating their boot class
	 * 
	 *	@param string[] $baseCollections
	 */
	public function init($baseSchemaNames)
	{
		foreach ($baseSchemaNames as $baseSchemaName) {
			$mainDomain = $this->bootMainDomainFile($baseSchemaName);

			if ($mainDomain) {
				// EventSubscriberInterface
				// Add listener in MainDomain
				$this->container->eventDispatcher->addSubscriber($mainDomain);
			}

			$this->mainDomainCollections[$baseSchemaName] = $mainDomain;
		}
	}


	public function initLoadSchema($schemaPath)
	{
		$baseSchemaNames = $this->loadSchema($schemaPath)->base;
		
		$this->init($baseSchemaNames);
	}

	/**
	 * Return if a Main Domain is available
	 * Can be used by other Main domains to test if their dependencies are met
	 *
	 * @param $name The name of the MainDomain
	 */
	public function isAvailable($mainDomain)
	{
		return in_array($mainDomain, $this->getMainDomainNames());
	}

	/**
	 * Register all ServiceProvider of each main domain.
	 */
	public function registerAllServices()
	{
		foreach ($this->getMainDomainNames() as $mainDomain) {
			$this->registerServices($mainDomain);
		}
	}


	/**
	 * Register services for a specified main domain
	 */
	public function registerServices($mainDomain)
	{
		$className = Str::studly($mainDomain);
		$fullClassName = "\\JingCafe\\$className\\ServiceProvider\\ServiceProvider";

		if (class_exists($fullClassName)) {
			$serviceProvider = new $fullClassName;
			$serviceProvider->register($this->container);
		}
	}



	/**
	 * Load list of collection from JSON schema file
	 *
	 * @param string $schemaPath
	 * @return string[]
	 */
	protected function loadSchema($schemaPath)
	{
		$schemaFile = @file_get_contents($schemaPath);

		if (!$schemaFile) {
			throw new FileNotFoundException("Error: Unable to determine Sprinkle load order.  File '$schemaPath' not found or unable to read. Please create a 'sprinkles.json' file and try again.");
		}

		return json_decode($schemaFile);
	}

}

