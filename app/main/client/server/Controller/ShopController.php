<?php

namespace JingCafe\Client\Controller;

use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Controller\Controller;

class ShopController extends Controller
{
	
	public function getShop($request, $response ,$args) 
	{
		$this->container->db;

		$classMapper = $this->container->classMapper;

		$shopInfo = $classMapper->staticMethod('shop', 'select', ['id', 'name', 'brand', 'phone', 'email', 'address', 'introduction', 'advertisements'])->find(1);

		$shop = ['shop' => $shopInfo, 'activities' => $shopInfo->activities];

		return $response->withJson($shop, 200);
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
		$products = $product->select(['id', 'name', 'product_key', 'price', 'profile'])->where(
			[
				'last_category_id' 	=> $category->id,
				'flag_enabled'		=> true,
				// 'shop_id' 			=> 1
			])->get();
		
		foreach ($products as $key => $product) {
			$product['name'] = CBMCryptography::decrypt($product['name']);
		}
		
		return $response->withJson($products, 200);
	}

	public function getProductDetail($request, $response, $args)
	{

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

	
}