
export default class ShopService {

	constructor(HttpService) {	
		this.HttpService = HttpService;
	}

	getShopLayoutInfo() {
		return this.HttpService.get('/shop/', true);
	}


	static setup() {
		return new ShopService(...arguments);
	}


}

ShopService.setup.$inject = ['HttpService'];
