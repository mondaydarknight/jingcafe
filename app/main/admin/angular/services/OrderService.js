import HttpService from './HttpService';

class OrderService extends HttpService {

	constructor($http, AuthService, CONSTANTS) {
		'ngInject';

		super($http, AuthService, CONSTANTS);
	}

	composition() {
		return this.get('/admin/order/composition', true);
	}

	dateTime(params) {
		return this.get('/admin/order/dateTime', params || {dateTimeType: 'today'});
	}

	user(params) {
		return this.get('/admin/order/user', params || {userType: 'username'});
	}

	alter(params) {
		return this.put('/admin/order/alter', params);
	}


	
}


export default OrderService;


