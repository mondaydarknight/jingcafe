<?php


/**
 * Error Exception handler
 * 
 * @author Mong Cheng
 *
 */

namespace JingCafe\Core\Middleware;

use Exception;

class ErrorHandler {


	/**
	 * Build the error handler of middleware for container errorHandler
	 *
	 * @param Request
	 * @param Response
	 * @param Exception
	 * @return response
	 */
	public function __invoke(Request $request, Response $response, Exception $exception) 
	{	
		
	}



}

