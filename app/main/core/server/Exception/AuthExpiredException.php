<?php


namespace JingCafe\Core\Exception;



class AuthExpiredException extends HttpException
{
	protected $defaultMessage = 'ACCOUNT.EXPIRED';
	protected $httpErrorCode = 403;
}
