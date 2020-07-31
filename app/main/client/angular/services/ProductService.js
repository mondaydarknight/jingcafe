import HttpService from './HttpService';

class ProductService  extends HttpService {

	constructor($state, $http, AuthService, CONSTANTS) {
		'ngInject';

		super($http, AuthService, CONSTANTS);

		this.$state = $state;
	}

	directToDefaultProductList() {
		return this.$state.go('shop.product.list', {productCategory: 'coffee_bean'});
	}

	categories() {
		return this.get('/shop/product/categories');
	}

	recommendProducts() {
		return this.get('/shop/product/recommend');
	}

	latestProduct() {
		return this.get('/shop/product/latest');
	}

	overview(params) {
		return this.get('/shop/product', {uri: params.productCategory});
	}

	detail(params) {
		return this.get('/shop/product/detail', {productId: params.productId, productKey: params.productKey}, true);		
	}

}

export default ProductService;