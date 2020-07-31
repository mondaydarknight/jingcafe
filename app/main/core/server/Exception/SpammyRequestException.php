<?php

/**
 * JingCafe
 *
 * @link 
 * @license
 */

namespace JingCafe\Core\Exception;

/**
 * SpammyRequestException
 * 
 * Check honeypot token in website. If not found we'll thron SpammyRequestException
 */
class SpammyRequestException extends HttpException
{

}


