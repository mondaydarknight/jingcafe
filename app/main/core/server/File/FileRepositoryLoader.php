<?php




namespace JingCafe\Core\File;


abstract class FileRepositoryLoader {

	/**
     * @var array An array of paths to ultimately load the data from.
     */
	protected $paths = [];


	public function __construct($paths = []) 
	{
		$this->setPaths($paths);
	}

	/**
     * Fetch and recursively merge in content from all file paths.
     *
     * @return array
     */
	public function load($skipMissing = false)
	{
		$result = [];

		foreach ($this->paths as $key => $path) {			
			$contents = $this->loadFile($path, $skipMissing);

			$result = array_replace_recursive($result, $contents);
		}

		return $result;
	}

	public function loadFile($path, $skipMissing)
	{
		if (!file_exists($path)) {
            if ($skipMissing) {
                return [];
            } else {
                throw new FileNotFoundException("The repository file '$path' could not be found.");
            }
        }

        // If the file exists but is not readable, we always throw an exception.
        if (!is_readable($path)) {
            throw new FileNotFoundException("The repository file '$path' exists, but it could not be read.");
        }

        return $this->parseFile($path);
	}

	/**
     * Add a file path to the top of the stack.
     *
     * @param string $path
     */
	public function addPath($path)
	{
		$this->paths[] = rtrim($path, '/\\');
        return $this;
	}

	public function prependPath($path)
	{
		array_unshift($this->paths, rtrim($path, '/\\'));
		return $this;
	}


	public function setPaths($paths) 
	{
		if (!is_array($paths)) {
			$paths = [$paths];
		}	

		$this->paths = [];

		foreach ($paths as $key => $path) {
			$this->addPath($path);
		}

		return $this;
	}

	public function getPaths()
	{
		return $this->paths;
	}

	/**
	 * Fetch content from a single file
	 * @param string $path
	 * @return array
	 */
	abstract protected function parseFile($path);
}
