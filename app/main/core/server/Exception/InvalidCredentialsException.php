<?php


namespace JingCafe\Core\Exception;


/**
 * Invalid credentials exception. Used when an account fails authentication for some reason.
 *
 * @author Mong Cheng
 */
class InvalidCredentialsException extends HttpException
{
	protected $defaultMessage = 'USER_OR_PASS_INVALID';
	protected $httpErrorCode = 403;
}
