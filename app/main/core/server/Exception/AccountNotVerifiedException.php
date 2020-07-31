<?php

namespace JingCafe\Core\Exception;


/**
 * Account not verified exception. Used when an account fails authentication for some reason.
 *
 * @author Mong Cheng
 */
class AccountNotVerifiedException extends HttpException
{
	protected $defaultMessage = 'ACCOUNT.UNVERIFED';
	protected $httpErrorCode = 403;
}