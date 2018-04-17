<?php

/**
 * Route configuration of Client
 *
 * @author Mong
 */

namespace JingCafe\Client;

global $app;


$app->group('/shop', function() use ($app) {
	$app->get('/', 'JingCafe\Client\Controller\ShopController:getShop');


	$app->group('/product', function() use ($app) {
		$app->get('/', 'JingCafe\Client\Controller\ShopController:getProducts');

		$app->get('/detail', 'JingCafe\Client\Controller\ShopController:getProductDetail');
		
		$app->get('/category', 'JingCafe\Client\Controller\ShopController:getProductCategory');
	});
	
});


$app->group('/client', function() use ($app) {
	
	$app->post('/register', 'JingCafe\Client\Controller\ClientController:register');

	$app->post('/login', 'JingCafe\Client\Controller\ClientController:login');

});