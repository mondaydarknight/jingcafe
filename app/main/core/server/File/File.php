<?php




namespace JingCafe\Core\File;

use Illuminate\Contracts\Filesystem\FileNotFoundException;

class File {


	/**
	 * Determine if a file or directory exist
	 *
	 * @param string 	$path
	 */
	public static function exists($path)
	{
		return file_exists($path);
	}

	/**
	 * Get contents of a file
	 *
	 * @param string 	$path
	 * @param bool 		$lock
	 * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
	 * @return string 	
	 */
	public static function get($path, $lock = false)
	{
		if (self::isFile($path)) {
			return $lock ? self::sharedGet($path) : file_get_contents($path);
		}

		throw new FileNotFoundException("File does not exist at path {$path}");
	}

	/**
	 * Get contents of file with shared access.
	 *
	 * @param string 	$path
	 * @return string 
	 */
	public static function sharedGet($path)
	{
		$contents = '';
		$handle = fopen($path, 'rb');

		if ($handle) {
			try {
				if (flock($handle, LOCK_SH)) {
					clearstatcache(true, $path);

					$contents = fread($handle, $this->size($path) ?: 1);

					flock($handle, LOCK_UN);
				}
			} finally {
				fclose($handle);
			}
		}

		return $contents;
	}

	/**
	 * Get mime-type of a given file 
	 *
	 * @param string 	$path
	 * @return string | false
	 */
	public static function mimeType($path)
	{
		return finfo_file(finfo_open(FILEINFO_MIME_TYPE), $path);
	}

	/**
	 * Get a file size of given file
	 *
	 * @param string 	$path
	 * @return int
	 */
	public static function size($path)
	{
		return filesize($path);
	}

	/**
	 * Determine if file is exist
	 *
	 * @param string 	$file
	 * @return bool 
	 */
	public static function isFile($file)
	{
		return is_file($file);
	}


}