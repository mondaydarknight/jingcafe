<?php



namespace JingCafe\Core\Exception;

/**
 * NotFoundException
 *
 * The exception should be thrown when a resource could not be found.
 */

class NotFoundException extends HttpException
{

	/**
     * {@inheritDoc}
     */
    protected $httpErrorCode = 404;
    
    /**
     * {@inheritDoc}
     */     
    protected $defaultMessage = 'ERROR.404.TITLE';

}


