<?php

/** 
 * UserMessage
 *
 * @link https://github.com/jing-cafe/support
 */

namespace JingCafe\Core\Exception;

/**
 * UserMessage
 *
 * A user-viewable message, consisting of a message string or message token, and zero more parameters for this message.
 *
 * @author Alexander Weissman (https://alexanderweissman.com)
 *
 */

class UserMessage 
{
	/**
	 * @var string 	The user-viewable error message.
	 */
	public $message;

	/**
	 * @var array 	The parameters to be filled in for any placeholders in the message.
	 */
	public $parameters = [];

	/**
	 * Public constructor
	 *
	 * @param string 	$message
	 * @param array 	$parameters 	The parameters to be filled in for any placeholders in the messages.
	 */
	public function __construct($message, $parameters = [])
	{
		$this->message = $message;
		$this->parameters = $parameters;
	}
}