<?php

/**
 * Route configuration of Client
 *
 * @author Mong
 */

namespace JingCafe\Client;

global $app;



$app->group('/client', function() use ($app) {
	
	$app->get('/isLoggedIn', 'JingCafe\Client\Controller\ClientController:isLoggedIn');

	$app->get('/logout', 'JingCafe\Client\Controller\ClientController:logout');

	$app->get('/basicInfo', 'JingCafe\Client\Controller\ClientController:basicInfo');

	$app->get('/detailInfo', 'JingCafe\Client\Controller\ClientController:detailInfo');

	$app->get('/verify-account', 'JingCafe\Client\Controller\ClientController:verifyAccount');

	$app->get('/checkoutInfo', 'JingCafe\Client\Controller\ClientController:getUserCheckoutInfo');
	


	$app->post('/register', 'JingCafe\Client\Controller\ClientController:register');

	
	$app->post('/settle-payment', 'JingCafe\Client\Controller\ClientController:settlePayment');

	$app->post('/resend-account-mail', 'JingCafe\Client\Controller\ClientController:resendAccountVerifiedMail');


	$app->post('/login', 'JingCafe\Client\Controller\ClientController:login');
	

	$app->puT('/info', 'JingCafe\Client\Controller\ClientController:updateUserInfo');




	$app->group('/forget-password', function() use ($app) {
		$app->post('/verify', 'JingCafe\Client\Controller\ClientController:sendForgetPasswordEmail');
	
		$app->put('/reset', 'JingCafe\Client\Controller\ClientController:resetPassword');
	});

	
	$app->group('/order', function() use ($app) {
		$app->get('', 'JingCafe\Client\Controller\ClientController:getOrders');

		$app->get('/detail', 'JingCafe\Client\Controller\ClientController:getDetailOrder');

		$app->get('/cancel', 'JingCafe\Client\Controller\ClientController:getOrderCancelReasons');

		$app->post('/', 'JingCafe\Client\Controller\ClientController:checkout');

		$app->put('/cancel', 'JingCafe\Client\Controller\ClientController:cancelUserOrder');

	});

});

