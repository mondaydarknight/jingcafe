<?php

namespace JingCafe\Core\Mail;

/**
 * MailMessage
 *
 * Represents a basic mail message, containing the static subejct and body.
 * @author Mong Cheng
 */
class HtmlMailMessage extends MailMessage {

	/**
	 * @var mixed[] A list of placeholder values to use when rendering this message
	 */ 
	protected $params;

	/**
	 * @var The template object to source the content
	 */
	protected $template;

	/**
	 * @var Mail obejct, used to render template
	 */
	protected $view;

	/**
	 * Create a new HtmlMailMessage instance
	 * 
	 * @param 	Twig 	The twig view object used to render mail object.
	 * @param 	string 	Set the twig template to use for message.
	 * @todo 	Manually merge in global variables for block rendering
	 */
	public function __construct($view, $filename = null)
	{
		$this->view = $view;

		$twig = $this->view->getEnvironment();

		$this->params = $twig->getGlobals();

		if ($filename !== null) {
			$this->template = $twig->loadTemplate($filename);
		}
	}

	/**
	 * Merge in any additinoal global Twig to use when rendering the message
	 * @param mixed[] $params
	 */
	public function addParams($params = [])
	{
		$this->params = array_replace_recursive($this->params, $params);
		return $this;
	}

	/**
	 * {@inheritDoc}
	 */ 
	public function renderSubject($params = [])
	{
		$params = array_replace_recursive($this->params, $params);
		return $this->template->renderBlock('subject', $params);
	}

	/**
	 * {@inheritDoc}
	 */
	public function renderBody($params = [])
	{
		$params = array_replace_recursive($this->params, $params);
		return $this->template->renderBlock('body', $params);
	}

	/**
	 * Set the Twig template object for message
	 * @param Twig_Template The Twig template object, source the content for message
	 */
	public function setTemplate($template)
	{
		$this->template = $template;
		return $this;
	}

}




