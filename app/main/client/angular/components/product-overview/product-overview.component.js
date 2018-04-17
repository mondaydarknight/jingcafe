
import productOverviewTemplate from './product-overview.template.html';

class ProductOverviewController {

	constructor($scope, $state, toastr, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		// Need to find best way to access image file...
		this.$$productImagePath = require.context('../../../../../../assets/img/products/', true);
		console.log(this.$$productImagePath('1suna9X_mrEZ.png', true));
	}

	$postLink() {

	}

	set products(products) {
		if (!products) {
			throw new Error(this.CONSTANTS.ERROR.UNKNOWN);
		}

		if (products.status !== 200) {
			throw new Error(products.data.exception[0].message || this.CONSTANTS.ERROR.UNKNOWN);
		}

		// If the products not found.
		if (!products.data) {
			this.errorMessage = this.CONSTANTS.WARNING.PRODUCT_NOT_FOUND;
			return this._products = [];
		}

		this._products = products.data;		
	}

	get products() {
		return this._products;
	}


}


export const productOverviewComponent = {
	template: productOverviewTemplate,
	controller: ProductOverviewController,
	controllerAs: '$vm',
	bindings: {
		products: '<'
	}
};