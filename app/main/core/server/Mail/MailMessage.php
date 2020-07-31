<?php


namespace JingCafe\Core\Mail;

/**
 * MailMessage Class
 *
 * Represents a basic mail message, containing a static subject and body.
 * 
 * @author Mong Cheng
 */
abstract class MailMessage {

	/**
	 * @var string 	The current sender email address
	 */
	protected $fromEmail = "";

	/**
	 * @var string 	The current sender name
	 */
	protected $fromName = null;

	/**
	 * @var EmailRecipients[] 	A list of recipients for message
	 */
	protected $recipients = [];

	/**
	 * @var string 	The current reply-to email.
	 */
	protected $replyEmail = null;

	/**
	 * @var string 	The current reply-to name
	 */
	protected $replyName = null;

	/**
	 * Get the fully rendered text of the message subject
	 *
	 * @return string
	 */
	abstract public function renderSubject($params = []);

	/**
	 * Get the fully rendered text of the message body
	 *
	 * @return string
	 */
	abstract public function renderBody($params = []);

	/**
	 * Add the email recipient.
	 * @param EmailRecipient 
	 */
	public function addEmailRecipient(EmailRecipient $recipient)
	{
		$this->recipients[] = $recipient;
		return $this;
	}

	/** 
	 * Clear all recipients for message.
	 */
	public function clearRecipients()
	{
		$this->recipients = [];
	}

	/**
	 * Set sender information for message
	 * This is a shortcut for calling setFromEmail, setFromName, setReplyEmail, setReplyName
	 * @param array 	
	 */
	public function from($fromInfo = [])
	{
		$this->setFromEmail(isset($fromInfo['email']) ? $fromInfo['email'] : '');
		$this->setFromName(isset($fromInfo['name']) ? $fromInfo['name'] : null);
		$this->setReplyEmail(isset($fromInfo['reply_email']) ? $fromInfo['reply_email'] : null);
		$this->setReplyName(isset($fromInfo['reply_name']) ? $fromInfo['reply_name'] : null);

		return $this;
	}

	/**
	 * Set the sender name
	 * @param string 
	 */
	public function setFromEmail($fromEmail)
	{
		$this->fromEmail = $fromEmail;
		return $this;
	}

	/**
	 * Set the sender reply-to address
	 * @param string 
	 */
	public function setFromName($fromName)
	{
		$this->fromName = $fromName;
		return $this;
	}

	/**
	 * Set the sender reply-to email
	 * @param string
	 */
	public function setReplyEmail($replyEmail)
	{
		$this->replyEmail = $replyEmail;
		return $this;	
	}

	/**
	 * Set the sender reply-to name
	 * @param string
	 */
	public function setReplyName($replyName)
	{
		$this->replyName = $replyName;
		return $this;
	}

	
	/** 
	 * Get the sender email address.
	 * @return string
	 */
	public function getFromEmail()
	{	
		return $this->fromEmail;
	}

	/**
	 * Get the sender email name
	 * @return string
	 */
	public function getFromName()
	{
		return isset($this->fromName) ? $this->fromName : $this->getFromEmail();
	}
	
	/**
	 * Get the list of recipients for this message.
	 * @return array
	 */
	public function getRecipients()
	{
		return $this->recipients;
	}


	/**
	 * Get the current reply-to eamil
	 * @return string
	 */
	public function getReplyEmail()
	{
		return isset($this->replyEmail) ? $this->replyEmail : $this->getFromEmail();
	}

	/**
	 * Get the current reply-to name
	 * @return string
	 */
	public function getReplyName()
	{
		return isset($this->replyName) ? $this->replyName : $this->getFromName();
	}


}





