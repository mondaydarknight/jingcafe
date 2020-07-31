import HttpService from './HttpService';

class UserService extends HttpService {

	constructor($rootScope, $http, AuthService, CONSTANTS) {
		'ngInject';

		super($http, AuthService, CONSTANTS);
		this.$rootScope = $rootScope;
	}


	/**
	 * Determine whether the current user is exist for every page routing.
	 */
	detectUserIdentity() {
		return this.get('/client/isLoggedIn').then((response) => {
			this.AuthService.user = response.data;
			this.AuthService.isAuthenticated = true;
			return response;
		}, (error) => {
			this.AuthService.user = null;
			this.AuthService.isAuthenticated = false;
			return error;
		});
	}

	/**
	 * User logout
	 */
	logout() {
		return this.get('/client/logout').then((response) =>  {
			this.AuthService.isAuthenticated = false;
			this.AuthService.user = null;
			this.$rootScope.$broadcast('refreshUserCurrentStatus', false);

			if (response.data.csrf) {
				this.AuthService.csrf[response.data.csrf['csrf-name-key']] = response.data.csrf['csrf-name'];
				this.AuthService.csrf[response.data.csrf['csrf-value-key']] = response.data.csrf['csrf-value'];
			}
			
			return response;
		});
	}
	
	getUserDetailInfo() {
		return this.get('/client/detailInfo');
	}

	checkoutInfo() {
		return this.get('/client/checkoutInfo');
	}
	
	unpaidOrders() {
		return this.get('/client/order?type=unpaid');
	}

	producedOrders() {
		return this.get('/client/order?type=produced');
	}

	completedOrders() {
		return this.get('/client/order?type=completed');
	}

	canceledOrders() {
		return this.get('/client/order?type=canceled');
	}

	/**
	 * Get the detail of order
	 * @param object[orderId]
	 */
	getDetailOrder(params) {
		return this.get('/client/order/detail', params);
	}

	/**
	 * Get the reasons of the order that canceled.
	 */
	getCancelReasons() {
	 	return this.get('/client/order/cancel', true);
	}
	
	/**
	 * User register 
	 */
	register(userInfo) {
		return this.post('/client/register', userInfo);
	}

	/** 
	 * Login process
	 * @param {account: string, password: string}
	 */
	loginWithCredentials(params) {
		return this.post('/client/login', params).then((response) => {
			if (response.status === 200) {
				this.AuthService.isAuthenticated = true;
				this.AuthService.user = response.data;
			}
			return response;			
		});	
	}
	
	sendForgetPasswordEmail(params) {
		return this.post('/client/forget-password/verify', params);
	}

	resetPassword(params) {
		return this.put('/client/forget-password/reset', params);
	}

	/**
	 * Create the new order in database.
	 */
	checkout(params) {
		return this.post('/client/order/', params);
	}

	settlePayment(params) {
		return this.post('/client/settle-payment', params);
	}
	
	/**
	 * resend email to user for verification (HTTP: POST)
	 * @param object 	$params 	{verifyKey: string}
	 */
	resendAccountMail(params) {
	 	return this.post('/client/resend-account-mail', params);
	}

	/**
	 * Cancel user order (HTTP: PUT) 
	 */
	 cancelOrder(params) {
	 	return this.put('/client/order/cancel', params);
	 }

	updateInfo(params) {
	 	return this.put('/client/info', params);
	}

}

export default UserService;


