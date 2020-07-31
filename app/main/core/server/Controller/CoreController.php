<?php


namespace JingCafe\Core\Controller;

use Exception;
use JingCafe\Core\File\File;
use JingCafe\Core\Util\CBMCryptography;

use JingCafe\Core\Notification\NotificationManager;

use Illuminate\Database\Capsule\Manager as Capsule;


class CoreController extends Controller 
{
	/**
	 * Render the index page with twig extension.
	 */
	public function pageIndex($request, $response, $args)
	{

		return $this->container->view->render($response, 'base.html.twig');
	}

	/**
	 * Render the error page with twig service
	 */
	public function pageError($request, $response, $args)
	{
		return $this->container->view->render($response, 'error404.html.twig');
	}


	/**
	 *
	 *
	 */
	public function pageSelectLogistic($request, $response, $args)
	{
		return $this->container->view->render($response, 'select-logistic.html');
	}



	/**
	 * Get Assets png, jpg, jpeg, gif file
	 *
	 * @param Request 
	 * @param Response
	 * @param args 		['filePath' => '/example/sample.jpg']
	 */
	public function getAssets($request, $response, $args)
	{
		if (!isset($args['filePath']) || !preg_match('/\.(?:png|jpg|jpeg|gif)$/', $args['filePath'])) {
			return $response->withStatus(404);
		}
		
		// Asset outside folder from app 
		$filePath = realpath(\JingCafe\APP_DIR . '/..') . DIRECTORY_SEPARATOR . \JingCafe\ASSET_DIR_NAME . DIRECTORY_SEPARATOR . rtrim($args['filePath'], '/\\');
				
		if (!File::exists($filePath)) {
			return $response->withStatus(404);
		}

		$file = File::get($filePath);
		$response->withHeader('Content-Type', File::mimeType($filePath));

		return $response->write($file);
	}

	public function test($request, $response)
	{
		
	}

}







