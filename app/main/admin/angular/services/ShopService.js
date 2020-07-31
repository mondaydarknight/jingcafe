import HttpService from './HttpService';


class ShopService extends HttpService {

	constructor($http, AuthService, CONSTANTS) {
		'ngInject';

		super($http, AuthService, CONSTANTS);
	}
	
	shop() {
		return this.get('/shop', true);
	}

	notifications() {
		return this.get('/admin/notification', true);
	}

	update(params) {
		return this.put('/admin/shop/update', params);
	}

	removeNotification(params) {
		return this.put('/admin/notification/remove', params);
	}

}

export default ShopService;
