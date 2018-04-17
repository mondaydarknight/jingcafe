<?php

/** 
 * Client Controller
 *
 * @author Mong cheng
 */
namespace JingCafe\Client\Controller;

use Exception;
use Illuminate\Database\Capsule\Manager as Capsule;

use JingCafe\Core\Controller\Controller;
use JingCafe\Core\Exception\NotFoundException;
use JingCafe\Core\Exception\SpammyRequestException;
use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Util\Password;
use JingCafe\Core\Util\ServerSideValidator;
use JingCafe\Core\Util\Validator;
use JingCafe\Core\Schema\RequestSchema;
use JingCafe\Core\Schema\RequestTransformer;



class ClientController extends Controller
{


	/**
	 * Get the products of same category
	 */
	public function getProducts($request, $response, $args)
	{
		
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

		$productId = Validator::validateInteger($params['productId']);

		$this->container['db'];
		$classMapper = $this->container->classMapper;

		$productDetail = $classMapper->staticMethod('product', 'select', ['amount', 'characteristic', 'description', 'logistics_id'])->find($productId);
		
		return $response->withJson($productDetail, 200);
	}


	/**
	 * Process an new account request.
	 *
	 * This is throttled to prevent account enumeration, since it nneds to divulge when a email has been used.
	 * Process the request from the form on the registration page, checking that:
	 * !. The honeypot was not modified. 
	 * 2. Account registration is enabled.
	 * 3. The user is not already logged in.
	 * 4. Valid information information was entered.
	 * @deprecated 5. The captcha, if enabled is correct. 
	 * 6. The username and email are not already taken.
	 * Request type: POST
	 * @return User Object for the user record that wass created.
	 */
	public function register($request, $response, $args)
	{
		$params = $request->getParsedBody();

		/**
		 * Check the honeypot. "spiderSpam" is not a real field. 
		 * It's hidden on the main page and must be submitted with its default value for this to be processed.
		 */
		if (!isset($params['spiderSpam']) || $params['spiderSpam'] !== 'http://') {
			throw new SpammyRequestException('Possible spam received: ' . print_r($params));
		}

		$classMapper = $this->container->classMapper;
		$config = $this->container->config;

		if (!$config['site.registration.enabled']) {
			// Disable registration
			return $response->withStatus(403);
		}
		
		// Register authenticator service of container 
		$authenticator = $this->container->authenticator;

		if ($authenticator->isCurrentUserExist()) {
			return $response->withStatus(403);
		}

		// Load the request schema		
		$locator = $this->container->locator;
		$schema = new RequestSchema($locator->findResource('schema://register.yaml', true));
		
		// Whitelist and set parameters defaults
		$data = RequestTransformer::transform($schema, $params);
		$data = ServerSideValidator::loadSchema($schema)->validate($data);
		
		// Encrypt columns 
		$schemaFiles = $schema->all();
		array_walk($schemaFiles, function($field, $fieldName) use (&$data) {
			if (isset($field['encrypted']) && isset($data[$fieldName])) {
				$data[$fieldName] = CBMCryptography::encrypt($data[$fieldName]);
			}
		});

		// Throttle requests
	
		// Check if username exist.		
		if ($classMapper->staticMethod('user', 'findUnique', 'account', $data['account'])) {
			return $response->withJson('帳號已註冊', 400);
		}


		// Check captcha if requuired


		// Hash password
		$data['password'] = Password::hash($data['password']);

		Capsule::transaction(function() use ($classMapper, $data, $config) {
			// Create user
			$user = $classMapper->createInstance('user', $data);
			$user->save();

			// Send email...
		});

	}


	public function login($request, $response, $args)
	{
		$authenticator = $this->container->authenticator;

		if ($authenticator->isCurrentUserExist()) {
			return $response->withStatus(200);
		}

		$params = $request->getParsedBody();
		$classMapper = $this->container->classMapper;
		$config = $this->container->config;
		$schema = new RequestSchema($this->container->locator->findResource('schema://login.yaml'));
		
		try {
			$data = RequestTransformer::transform($schema, $params);
			$userParams = ServerSideValidator::loadSchema($schema)->validate($data);
		} catch(Exception $e) {
			return $response->withJson($e->getMessage(), 400);
		}
		
		$userParams['account'] = CBMCryptography::encrypt($userParams['account']);

		// Authenticate
		try {
			$authenticator->authenticate($userParams, true);
			return $response->withStatus(200);
		} catch(Exception $e) {
			return $response->withJson($e->getMessages(), $e->getHttpErrorCode());
		}
		
	}

}