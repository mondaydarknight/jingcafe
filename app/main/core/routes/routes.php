<?php




namespace JingCafe\Core;


global $app;


$app->get('/', 'JingCafe\Core\Controller\CoreController:pageIndex')
	->setName('index');

$app->get('/select-logistic', 'JingCafe\Core\Controller\CoreController:pageSelectLogistic');

$app->get('/test', 'JingCafe\Core\Controller\CoreController:test');


$app->get('/error', 'JingCafe\Core\Controller\CoreController:pageError');


$app->get('/assets/{filePath: [a-zA-Z0-9./\-]+}', 'JingCafe\Core\Controller\CoreController:getAssets');


$app->group('/shop', function() use ($app) {
	
	$app->get('', 'JingCafe\Core\Controller\ShopController:getShop');

	$app->get('/counties', 'JingCafe\Core\Controller\ShopController:getTaiwanCounties');

	$app->group('/service', function() use ($app) {
		$app->get('/statement', 'JingCafe\Core\Controller\ShopController:getStatement');
	});


	$app->group('/logistics', function() use ($app) {
		$app->get('', 'JingCafe\Core\Controller\ShopController:getStoreData');
	});


	$app->group('/product', function() use ($app) {
		$app->get('', 'JingCafe\Core\Controller\ShopController:getProducts');

		$app->get('/latest', 'JingCafe\Core\Controller\ShopController:getLatestProduct');

		$app->get('/detail', 'JingCafe\Core\Controller\ShopController:getProductDetail');
		
		$app->get('/categories', 'JingCafe\Core\Controller\ShopController:getProductCategory');
	
		$app->get('/recommend', 'JingCafe\Core\Controller\ShopController:getRecommendProducts');
	});
	
});





