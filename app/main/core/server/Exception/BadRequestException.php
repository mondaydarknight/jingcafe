<?php

namespace JingCafe\Core\Exception;

/**
 * BadRequestException 
 *
 * This exception should be thrown when a user has submitted an ill-formed request or other incorrect request
 * @author Mong Cheng.
 */
class BadRequestException extends HttpException
{
	/**
	 * {@inheritDoc}
	 */
	protected $httpErrorCode = 400;

	/**
	 * {@inheritDoc}
	 */
 	protected $defaultMessage = 'NO_DATA';
}

