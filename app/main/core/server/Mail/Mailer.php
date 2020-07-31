<?php

namespace JingCafe\Core\Mail;

use PHPMailer;
use phpmailerException;


class Mailer {

	const MAIL_TYPE = ['smtp', 'mail', 'qmail', 'sendmail'];

	/**
	 * @var Logger
	 */
	protected $logger;

	/**
	 * @var PHPMailer
	 */
	protected $phpMailer;

	/**
	 * Initiate the mailer instance
	 *
	 * @param Logger 	Monolog logger, used to dump debugging info for SMTP server transactions.
	 * @param mixed[] 	An array of configuration parameters for phpMailer.
	 * @throws \phpmailerException 	Wrong mailer config value given.
	 */
	public function __construct($logger, $config = [])
	{
		$this->logger = $logger;

		/**
		 * Tells the phpMailer to use excpetion insteade error code.
		 */
		$phpMailer = new PHPMailer(true);
		
		// Setting the debug output process.
		$debugOutput = function() use ($phpMailer) {
			$phpMailer->Debugoutput = function($message, $level) {
				$this->logger->debug($message);
			};
		};

		if (!isset($config['mailer'])) {
			return $debugOutput();
		}

		if (!in_array($config['mailer'], self::MAIL_TYPE)) {
			throw new phpmailerException('mailer must be one of the smtp, mail, qmail, sendmail.');
		}

		if ($config['mailer'] === 'smtp') {
			$phpMailer->isSMTP(true);
			$phpMailer->Host = $config['host'];
			$phpMailer->Port = $config['port'];
			$phpMailer->SMTPAuth = $config['auth'];
			$phpMailer->SMTPSecure = $config['secure'];
			$phpMailer->Username = $config['username'];
			$phpMailer->Password = $config['password'];
			$phpMailer->SMTPDebug = $config['debug'];

			if (isset($config['options'])) {
				if (isset($config['options']['isHtml'])) {
					$phpMailer->isHTML($config['options']['isHtml']);
				}

				foreach ($config['options'] as $name => $value) {
					$phpMailer->set($name, $value);
				}
			}

			if (isset($config['certificate']) && version_compare(PHP_VERSION, '5.3.0') >= 0) {
				$phpMailer->SMTPOptions = $config['certificate'];
			}
		}

		$this->phpMailer = $phpMailer;
		$debugOutput();
	}

	/**
	 * Get the underlying PHPMailer object
	 */
	public function getMailer()
	{
		return $this->phpMailer;
	}	

	/**
	 * Send mail message
	 *
	 * Send a single email to all recipients, as well as their CCs and BCCs,
	 * Since it's a single-header message, recipient-specific template data will not be included
	 *
	 * @param MailMessage 	$message
	 * @param bool 			$clearRecipients 	Set to true to clear the recipients in the message after calling send(). 
	 *											This helps avoid accidentally sending a message multiple times. 
	 * @throws phpmailerException 	The message could not be sent.
	 */
	public function send(MailMessage $message, $clearRecipients = true)
	{
		$this->phpMailer->From = $message->getFromEmail();
		$this->phpMailer->FromName = mb_convert_encoding($message->getFromName(), 'UTF-8', 'auto');
		$this->phpMailer->addReplyTo($message->getReplyEmail(), $message->getReplyName());

		foreach ($message->getRecipients() as $recipient) {
			$this->phpMailer->addAddress($recipient->getEmail(), $recipient->getName());
			
			if (!empty($recipient->getCCs())) {
				foreach ($recipient->getCCs() as $cc) {
					$this->phpMailer->addCC($cc['email'], $cc['name']);
				}
			}

			if (!empty($recipient->getBCCs())) {
				foreach ($recipient->getBCCs() as $bcc) {
					$this->phpMailer->addBCC($bcc['email'], $bcc['name']);
				}
			}
		}

		// resolve error code of mail content
		$this->phpMailer->Subject = $message->renderSubject();
		$this->phpMailer->Body = $message->renderBody();
		
		// Send mail, if fail throw the exception
		$this->phpMailer->send();

		// Clear recipients from PHPMailer object for iteration
		$this->phpMailer->clearAllRecipients();

		// Clear out the MailerMessage's internal recipient list
		if ($clearRecipients) {
			$message->clearRecipients();
		}
	}

	/**
	 * Send a MailMessage message, sending a seperate mail to each recipient
	 *
	 * If the message object supports message templates, this will render the template with the corresponding placeholder values.for each recipient.
	 *
	 * @param MailMessage 
	 * @param bool 			$clearRecipients Set to true to clear the recipients in the message after calling send()
	 * @throws phpmailerException
	 */ 
	public function sendIndividual()
	{

	}


}



