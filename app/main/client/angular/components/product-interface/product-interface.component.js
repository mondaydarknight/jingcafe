import productInterfaceTemplate from './product-interface.template.html';


class ProductInterfaceController {

	constructor(CONSTANTS) {
		'ngInject';

		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		
	}

	$postLink() {

	}

	set categories(categories) {
		if (!angular.isObject(categories) || categories.status !== 200) {
			throw new Error(categories.data.exception[0].message);	
		}

		this._categories = !!categories.data ? categories.data : [];
	}

	get categories() {
		return this._categories;
	}

}

export const productInterfaceComponent = {
	template: productInterfaceTemplate,
	controller: ProductInterfaceController,
	controllerAs: '$vm',
	bindings: {
		categories: '<'
	}
};

