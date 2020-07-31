<?php

 
/**
 * ShopController  
 * 
 *
 * @author Mong Cheng
 */

namespace JingCafe\Core\Controller;

use Exception;
use InvalidArguemntException;
use UnexpectedValueException;
use JingCafe\Core\Controller\Controller;
use JingCafe\Core\Exception\NotFoundException;
use JingCafe\Core\Mail\EmailRecipient;
use JingCafe\Core\Mail\HtmlMailMessage;
use JingCafe\Core\Schema\RequestSchema;
use JingCafe\Core\Schema\RequestTransformer;
use JingCafe\Core\ServiceProvider\StatementService;
use JingCafe\Core\Store\StoreManager;
use JingCafe\Core\Util\Util;
use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Util\OpenSSLCryptography;
use JingCafe\Core\Util\ServerSideValidator;
use JingCafe\Core\Util\Validator;

class ShopController extends Controller
{
	
	public function getShop($request, $response ,$args) 
	{
		$this->container->db;
		$classMapper = $this->container->classMapper;

		$shopInfo = $classMapper->staticMethod('shop', 'select', ['id', 'name', 'brand', 'phone', 'email', 'address', 'brief', 'advertisements', 'start_time', 'end_time'])->find(1);

		$shopInfo = array_merge($shopInfo->toArray(), StatementService::build($this->container->locator, 'shop')->getFile());
		$shopInfo['openingTime'] = substr($shopInfo['start_time'], 0, -3) . ' - ' . substr($shopInfo['end_time'], 0, -3);
		$shopInfo['categories'] = $categories = $classMapper->staticMethod('category', 'all');

		return $response->withJson($shopInfo, 200);
	}

	/**
	 * Get statement
	 *
	 * Fetch the statement of shop
	 * @return json 	{id, title, context}
	 */
	public function getStatement($request, $response, $args)
	{
		$params = $request->getQueryParams();
		
		if (!isset($params['type'])) {
			throw new NotFoundException('The undefiend variable of type in query parameters.');
		}

		$file = StatementService::build($this->container->locator, $params['type']);

		return $response->withJson($file->getFile(), 200);
	}


	
	public function getPrivacyStatement($request, $response, $args)
	{
		$privacyFile = $this->container->locator->findResource('schema://privacy-statement.yaml');

		if(!$privacyFile) {
			throw new NotFoundException('The privacy statement file was not found.');
		}

		$schema = new RequestSchema($privacyFile);

		return $response->withJson($schema->all(), 200);
	}



	/**
	 * Get recommend products
	 * This method is including eloquent model without eager loading
	 * 
	 * Origin method with join(): DB::table()->join()...
	 *
	 * @return array|null
	 */
	public function getRecommendProducts($request, $response, $args) 
	{	
		$this->container->db;
		
		$classMapper = $this->container->classMapper;

		$products = $classMapper->staticMethod('product', 'select', ['id', 'name', 'profile'])
			->orderBy('purchase_times', 'desc')->offset(0)->limit(10)->get();

		if ($products) {
			$config = $this->container->config;

			foreach ($products as $key => $product) {
				$product->profile = $config['path.assets.product'] . $product->profile;
			}
		}

		return $response->withJson($products, 200);
	}



	/**
	 * Get the specifiec products by uri
	 *
	 * @return array|null
	 */
	public function getProducts($request, $response, $args)
	{
		$params = $request->getQueryParams();

		if (!isset($params['uri'])) {
			throw new NotFoundException("Unknown uri of parameter, Check your request again.");
		}

		$this->container->db;

		$classMapper = $this->container->classMapper;
		
		/**
		 * Check uri exists of category cache of contianer
		 */
		$category = $classMapper->staticMethod('category', 'where', 'uri', $params['uri'])->first();
		if (is_null($category)) {
			throw new NotFoundException("category uri not exist.");
		}

		$product = $classMapper->createInstance('product');
		$products = $product->select(['id', 'name', 'price', 'discount', 'profile'])->where(
			[
				'last_category_id' 	=> $category->id,
				'flag_enabled'		=> true,
				// 'shop_id' 			=> 1
			])->get();
		
		if ($products) {
			$config = $this->container->config;
			foreach ($products as $key => $product) {
				$classMapper->staticMethod('product', 'translateDiscountAnPriceColumn', $product);
				$product->profile = $config['path.assets.product'] . $product->profile;	
				$products[$key] = Util::convertArrayKeyToCamelCase($product->toArray());
			}
		}
		
		return $response->withJson($products, 200);
	}




	/**
	 * Get the product detail information
	 *
	 * @param Request 	$request
	 * @param Response 	$response
	 * @param args 		$args
	 */
	public function getProductDetail($request, $response, $args)
	{
		$params = $request->getQueryParams();

		if (!isset($params['productId'])) {
			throw new NotFoundException("Unknown property of productId.");
		}

		$productId = Validator::validateInteger(trim($params['productId']));

		$this->container['db'];
		$classMapper = $this->container->classMapper;

		$product = $classMapper->staticMethod('product', 'select', ['name', 'en_name', 'amount', 'price', 'profile', 'discount', 'characteristic', 'description', 'logistics_id'])->where(['id' => $productId, 'flag_enabled' => true])->first();

		if (!$product) {
			throw new NotFoundException('Not found. Please check your params and send again.');
		}

		$product->id = $productId;
		$classMapper->staticMethod('product', 'translateDiscountAnPriceColumn', $product);
		$product->profile = $this->container->config['path.assets.product'] . $product->profile;
		$product = Util::convertArrayKeyToCamelCase($product->toArray());

		return $response->withJson($product, 200);
	}


	/**
	 * Get all categories of product
	 *
	 */
	public function getProductCategory($request, $response, $args)
	{
		$this->container->db;

		$classMapper = $this->container->classMapper;
		$categories = $classMapper->staticMethod('category', 'all');

		return $response->withJson($categories, 200);
	}

	/**
	 * Get the latest product for window commercial needs. 
	 * 
	 * @todo HTTP GET
	 */
	public function getLatestProduct($request, $response, $args)
	{
		$classMapper = $this->container->classMapper;

		$product = $classMapper->staticMethod('product', 'select', ['id', 'name', 'price', 'profile'])->orderBy('created_at', 'desc')->first();
		
		if ($product) {
			$config = $this->container->config;
			$product->profile = $config['path.assets.product'] . $product->profile;
		}
		
		return $response->withJson($product, 200);
	}

	/**
	 * Get all counties name of Taiwan (HTTP: GET)
 	 * 
	 */
	public function getTaiwanCounties($request, $response, $args)
	{
		$classMapper = $this->container->classMapper;
		
		return $response->withJson($classMapper->staticMethod('county', 'all'), 200);
		// $config = $this->container->config;
		// $curl = new Curl;
		// $apiResponse = $curl->get($config['logistics.county.url']);
		// return $response->withJson($apiResponse, $apiRespounse->headers['status_code']);
		
	}

	/**
	 * Get convenient stores of specific county  (HTTP: GET)
	 * According to current the convenient store website to accessing information of stores. 
	 *
	 * @todo Using CURL service communicate the ibon server API 
	 */
	public function getStoreData($request, $response, $args)
	{
		$params = $request->getQueryParams();
		
		if (!isset($params['name']) || !isset($params['methods'])) {
			throw new InvalidArguemntException("undefiend name or methods of parameters.");
		}

		$params['methods'] = explode('|', $params['methods']);

		$result = StoreManager::store($params)->get($params['name'], $params['methods']);
		
		return $response->withJson($result, 200);
	}

}

