<?php


namespace JingCafe\Core\File;


use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Parser;
use Symfony\Component\Yaml\Yaml;
use JingCafe\Core\File\JsonException;


class YamlFileLoader extends FileRepositoryLoader
{
	
	private $yamlParser;

	/**
	 * Save data in Yaml file
	 *
	 * @param string 	$path
	 * @param array 	$data
	 * @param int|null 	$level
	 */
	public static function saveFile($path, $data, $level = null)
	{

		try {
			if (!$level) {
				$data = Yaml::dump($data);
			} else {
				$data = Yaml::dump($data, $level);
			}

			file_put_contents($path, $data);
		} catch(ParseException $e) {
			throw new ParseException($e->getMessage());
		}
	}

	public function loadSchema($skipMessage = true)
	{
		$this->load($skipMessage);
	}

	/**
	 * @return array
	 */
	protected function parseFile($path)
	{
		$document = file_get_contents($path);

		if (!$document) {
			throw new FileNotFoundException("The file $path could not be found.");
		}

		try {
			$result = Yaml::parse($document);
		} catch (ParseException $e) {
			// Fallback to try and parse as JSON, if it fail to be parsed as YAML.
			$result = json_decode($document, true);
			if ($result === null) {
				throw new JsonException("The file '$path' does not contain a valid YAML or JSON document. 
					JSON error:" . json_last_error());
			}
		}

		return $result;
	}

}