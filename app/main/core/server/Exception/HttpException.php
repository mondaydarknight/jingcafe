<?php



namespace JingCafe\Core\Exception;

/**
 * An HTTP status code and user-viewable message during the application lifecycle.
 *
 * @author Mong Cheng
 */
class HttpException extends \Exception
{
	/**
	 * @var  Integer Default HTTP error code associated with exception.
	 *
	 */
	protected $httpErrorCode = 500;

	/** 
	 * @var array[UserMessage]
	 *
	 */
	protected $messages = [];

	/**
	 * @var string 	Default user-viewable error message associated with exception.
	 */
	protected $defaultMessage = 'SERVER_ERROR';


	/**
	 * Return Http status code associated with this exception
	 *
	 * @return int
	 */
	public function getHttpErrorCode()
	{
		return $this->httpErrorCode;
	}

	/**
	 * Return user-viewable messages associated with this exception.
	 * @return array[UserMessage]
	 */
	public function getUserMessages()
	{
		if (empty($this->messages)) {
			$this->addUserMessage($this->defaultMessage);
		}

		return $this->messages;
	}

	/**
	 * Add a user-viewable in error messages
	 *
	 * @param UserMessage|string 	Error message
	 * @param array 			The parameters to be filled in for any placeholders in the message
	 */
	public function addUserMessage($message, array $parameters = [])
	{	
		if ($message instanceof UserMessage) {
			$this->messages[] = $message;
		} else {
			$this->messages[] = new UserMessage($message, $parameters);
		}
	}



}