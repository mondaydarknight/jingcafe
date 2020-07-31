

class ToolFactory {

	constructor() {
		'ngInject';
	}


	isBoolean(value) {
		return Object.prototype.toString.call(value) === '[object Boolean]';
	}

	unset(unsetKey, arr, resort) {
		let tempArr = arr;
		
		arr = {};
		delete tempArr[unsetKey];

		let afterIndex = -1;

		for (let index in tempArr) {
			if (resort) {
				afterIndex++;
			} else {
				afterIndex = index;
			}

			arr[afterIndex] = tempArr[index];
		}

		return arr;
	}

	camelCase(value) {
		let convertKeys = value.split('_');
		let camelColumn = convertKeys[0];

		for (let i=1; i<convertKeys.length; i++) {
			camelColumn += convertKeys[i].charAt(0).toUpperCase() + convertKeys[i].slice(1);
		}

		return camelColumn;
	}


	convertToCamelCase(data) {
		if (!angular.isObject(data)) {
			return data;
		}

		for (let key in data) {
			let convertKeys = key.split('_');

			if (convertKeys.length > 1) {
				let camelColumn = convertKeys[0];

				for (let i=1; i<convertKeys.length; i++) {
					camelColumn += convertKeys[i].charAt(0).toUpperCase() + convertKeys[i].slice(1);
				} 

				data[camelColumn] = data[key];
				data[key] = undefined;
				delete data[key];
			}
		}

		return data;
	}

	getElementsIndex() {

	}

	/**
	 * Newst method to get elements of index
	 *
	 */
	getElementIndex(node) {
		let index = 0;

		while (node = node.previousElementSibling) {
			index++;
		}

		return index;
	}

	getNodeIndex(node) {
		let index = 0;

		while (node = node.previousSibling) {
			if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
				index++;
			}
		}

		return index;
	}

	

	static setup() {
		return new ToolFactory(...arguments);
	}
}	


export default ToolFactory;