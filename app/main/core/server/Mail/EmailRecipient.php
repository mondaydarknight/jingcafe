<?php

namespace JingCafe\Core\Mail;

/**
 * EmailRecipient class
 * 
 * A class representing aarecipient for a MailMessage with associated parameters
 * @author Mong Cheng
 */
class EmailRecipient {

	/**
	 * @var string The email address of this recipient.
	 */
	protected $email;

	/**
	 * @var string The name of recipient
	 */
	protected $name;

	/**
	 * @var array Any additional parameters (name => value) to use for rendering email template for this recipient
	 */
	protected $params = [];

	/**
	 * @var array 	A list of BCCs for recipient. Each BCC is an associative array with email and name properties.
	 */
	protected $bcc = [];

	/**
	 * @var array 	A list of CCs for recipient. Each CC is an associative array with email and name properties.
	 */
	protected $cc = [];

	/**
	 * Create a new EmailRecipient instance.
	 *
	 * @param string 	The primary recipient email address
	 * @param string 	The primary recipient name
	 * @param array 	An array of template parameters to render the email message with for this particular recipient.
	 */
	public function __construct($email, $name = "", $params = [])
	{
		$this->email = $email;
		$this->name = $name;
		$this->params = $params;
	}

	/**
	 * Add a CC for this primary recipient
	 * 
	 * @param string 	The CC recipient mail address.
	 * @param string 	The CC recipient name.
	 */
	public function cc($email, $name = '')
	{
		$this->cc[] = [
			'email' => $this->email,
			'name'	=> $this->name
		];
	}

	/**
	 * Add a BCC for this primary recipient.
	 *
	 * @param string 	The BCC recipient email.
	 * @param string 	The BCC recipient name.
	 */
	public function bcc($email, $name = '')
	{
		$this->bcc[] = [
			'email' => $email,
			'name'	=> $name
		];
	} 

	/** 
	 * Get the email of recipient
	 * @return string
	 */
	public function getEmail()
	{
		return $this->email;
	}

	/**
	 * Get the name of recipient
	 * @return string
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * Any additional parameters (name => value) to use for rendering email template for this recipient
	 * @return array
	 */
	public function getParams()
	{
		return $this->params;
	}


	/**
	 * Get the list of BCCs for this recipient
	 * @return array
	 */
	public function getBCCs() 
	{
		return $this->bcc;
	}	

	/**
	 * Get the list of CCs for this recipient
	 * @return array 
	 */
	public function getCCs()
	{
		return $this->cc;
	}


}






