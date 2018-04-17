
export default class ProductService {

	constructor(HttpService) {
		'ngInject';

		this.HttpService = HttpService;
	}

	getProductCategory() {
		return this.HttpService.get('/shop/product/category');
	}

	getProducts(params) {
		if (Object.getOwnPropertyNames(params).length > 0) {
			return this.HttpService.get('/shop/product/', {uri: params.productCategory}, true);
		}
	}

	getProductDetail(params) {
		if (Object.getOwnPropertyNames(params).length > 0) {
			return this.HttpService.get('/shop/product/detail', {productId: params.productId, productKey: params.productKey}, true);
		}
	}



}
