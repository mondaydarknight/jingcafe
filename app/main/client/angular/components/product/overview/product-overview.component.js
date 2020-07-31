
import productOverviewTemplate from './product-overview.template.html';

class ProductOverviewController {

	constructor($scope, $state, toastr, HttpService, ProductService, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.toastr = toastr;
		this.HttpService = HttpService;
		this.ProductService = ProductService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		// Need to find best way to access image file...
		// this.$$productImagePath = require.context('../../../../../../assets/img/products/', true);
	}

	$postLink() {

	}

	set products(products) {
		this._products = products || [];
	}

	get products() {
		return this._products;
	}

	directToProductDetail($event, $index) {
		$event.preventDefault();

		if (!$index in this.products) {
			this.toastr.error(this.CONSTANTS.UNKNOWN);
			throw new Error(`Undefined variable index ${$index} in products`);;
		}

		const chooseProduct = this.products[$index];
		this.parent.product = chooseProduct;
		return this.$state.go('shop.product.detail', {productId: chooseProduct.id, productKey: chooseProduct.product_key});
	}

	collectFavoriteProduct() {

	}

	compareProduct() {

	}

}


export const productOverviewComponent = {
	require: {
		parent: '^^productInterface'
	},
	template: productOverviewTemplate,
	controller: ProductOverviewController,
	controllerAs: '$vm',
	bindings: {
		products: '<'
	}
};