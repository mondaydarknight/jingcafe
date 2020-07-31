
class DocumentFactory {

	constructor() {
		'ngInject';


	}

	/**
	 * Find index of elements
	 *
	 * @return number
	 */
	getElementsIndex(elements, targetElement) {
		return Array.prototype.slice.call(elements).indexOf(targetElement);
	}

	static setup() {
		return new DocumentFactory(...arguments);
	}


}


export default DocumentFactory;
