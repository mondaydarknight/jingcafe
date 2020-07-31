<?php


namespace JingCafe\Core\Exception;


class AccountInvalidException extends HttpException
{
	protected $defaultMessage = 'ACCOUNT.INVALID';
	protected $httpErrorCode = 403;

}
