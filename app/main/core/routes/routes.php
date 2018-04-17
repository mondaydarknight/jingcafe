<?php




namespace JingCafe\Core;


global $app;


$app->get('/', 'JingCafe\Core\Controller\CoreController:pageIndex')
	->setName('index');


$app->get('/assets/{filePath: [a-zA-Z0-9./\-]+}', 'JingCafe\Core\Controller\CoreController:getAssets');

// $app->post('/product', 'JingCafe\Core\Controller\CoreController:getProducts');
