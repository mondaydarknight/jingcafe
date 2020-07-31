
export default class Util {

	constructor() {
		'@ngInejct';

	}

	isDescendant(parent, child) {
		let node = child.parentNode;

		while (node !== null) {
			if (node === parent) {
				return true;
			}

			node = node.parentNode;
		}

		return false;
	}

	hexToRGB(hex, alpha) {
		let r = parseInt(hex.slice(1,3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);

		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	/**
	 * Determine whether the element has the speicfic attributte name
	 */
	hasAttr(elem, attrName) {
		let attr = angular.element(attrName).attr(attrName);
		return typeof attr !== undefined && attr !== false;
	}


	static setup() {
		return new Util(...arguments);
	}
}

