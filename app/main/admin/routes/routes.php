<?php

namespace JingCafe\Admin;


global $app;


$app->group('/admin', function() use ($app) {

	$app->get('', 'JingCafe\Admin\Controller\AdminController:pageIndex')->setName('adminIndex');

	$app->get('/isLoggedIn', 'JingCafe\Admin\Controller\AdminController:isLoggedIn');

	$app->get('/logout', 'JingCafe\Admin\Controller\AdminController:logout');


	
	$app->post('/login', 'JingCafe\Admin\Controller\AdminController:login');



	$app->group('/clients', function() use ($app) {
		$app->get('/all', 'JingCafe\Admin\Controller\AdminController:getAllClients');
		
	});




	$app->group('/notification', function() use ($app) {
		$app->get('', 'JingCafe\Admin\Controller\AdminController:getAdminNotifications');

		$app->put('/remove', 'JingCafe\Admin\Controller\AdminController:removeNotification');
	});




	$app->group('/product', function() use ($app) {
		$app->get('/all', 'JingCafe\Admin\Controller\AdminController:getAllProducts');

		$app->post('/upload', 'JingCafe\Admin\Controller\AdminController:uploadProduct');

		$app->post('/remove', 'JingCafe\Admin\Controller\AdminController:removeProduct');
		// $app->delete('/remove/{productId}', 'JingCafe\Admin\Controller\AdminController:removeProduct');
	});



	$app->group('/shop', function() use ($app) {
		$app->put('/update', 'JingCafe\Admin\Controller\AdminController:updateShopInfo');
	});





	$app->group('/order', function() use ($app) {
		$app->get('/composition', 'JingCafe\Admin\Controller\AdminController:getOrderComposition');

		$app->get('/dateTime', 'JingCafe\Admin\Controller\AdminController:getOrdersByDateTime');

		$app->get('/user', 'JingCafe\Admin\Controller\AdminController:getOrdersByUser');
	

		$app->put('/alter', 'JingCafe\Admin\Controller\AdminController:alterOrders');
	});

});





