<?php

namespace JingCafe\Core\Exception;

/**
 * Disabled account exception. Used when an account has been disabled.
 *
 */
class AccountDisabledException extends HttpException
{
	protected $defaultMessage = 'ACCOUNT.DISABLED';
	protected $httpErrorCode = 403;
}


