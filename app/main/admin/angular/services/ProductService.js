import HttpService from './HttpService';

class ProductService extends HttpService {

	constructor($http, AuthService, FileUploader, CONSTANTS) {
		'ngInject';

		super($http, AuthService, CONSTANTS);
		this.FileUploader = FileUploader;
	}


	all() {
		return this.get('/admin/product/all'); 
	}

	/**
	 * @warning There are some error of reuqest parsedBody() 
	 * 
	 * We need to use post method to remove product
	 */
	remove(params) {
		return this.post(`/admin/product/remove`, params);
	}

	categories() {
		return this.get('/shop/product/categories', true);
	}

	upload(params) {
		return this.FileUploader.upload('/admin/product/upload', params);
	}


}


export default ProductService;