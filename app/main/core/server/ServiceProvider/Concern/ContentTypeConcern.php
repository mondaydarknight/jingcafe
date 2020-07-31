<?php


namespace Psr\Http\Message\ServerRequestInterface;

/**
 * Trait for classes that need to determine a request's accepted content type(s)
 * 
 * @author Mong Cheng
 */
trait ContentTypeConcern
{

	/**
	 * Known handled content types
	 * 
	 * @var array
	 */
	protected $contentTypes = [
		'application/json',
		'application/xml',
		'text/xml',
		'text/html',
		'text/plain'
	];

	/**
	 * Determine which content type we know about is wanted using Accept header
	 * 
	 * @note This method is a bare-bones implementation designed specifically for Slim's error handling requirements.
	 * @todo Consider a full-features solutions such as willdurand/negotiation for any other situation
	 *
	 * @param ServerRequestInterface $request
	 * @return bool|string
	 */
	protected function determineContentType(ServerRequestInterface $request, $ajaxDebug = false)
	{
		// For AJAX request, if AJAX debugging is turned on , always return html
		if ($ajaxDebug && $request->isXhr()) {
			return 'text/html';
		}

		$acceptHeader = $request->getHeaderLine('Accept');
		$selectedContentTypes = array_intersect(explode(',', $acceptHeader), $this->contentTypes);
		$count = count($selectedContentTypes);

		if ($count) {
			$current = current($selectedContentTypes);

			/**
             * Ensure other supported content types take precedence over text/plain
             * when multiple content types are provided via Accept header.
             */
			if ($current === 'text/plain' && $count > 1) {
				return next($selectedContentTypes);
			}

			return $current;
		}

		if (preg_match('/\+(json|xml)/', $acceptHeader, $matches)) {
            $mediaType = 'application/' . $matches[1];
            if (in_array($mediaType, $this->knownContentTypes)) {
                return $mediaType;
            }
        }

        return 'text/html';
	}

}