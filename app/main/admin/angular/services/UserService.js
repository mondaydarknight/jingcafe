import HttpService from './HttpService';

class UserService extends HttpService {

	constructor($http, AuthService, CONSTANTS) {
		'ngInject';

		super($http, AuthService, CONSTANTS);
	}

	/**
	 * Admin logout
	 *
	 * @method GET
	 * @return callback
	 */
	logout() {
		return this.get('/admin/logout').then((response) => {
			this.clearAdministratorAccount();
			return response;
		});
	}

	/**
	 * Determine whether the user is logged
	 * 
	 * @method GET
	 * @return callback
	 */
	isLoggedIn() {
		return this.get('/admin/isLoggedIn').then((response) => {
			this.activateAdministratorAccount(response.data);
			return response;
		}, (error) => {
			this.clearAdministratorAccount();
			return error;
		});
	}

	/**
	 * Login with credentials of admin 
	 * 
	 * @param object {account, password}
	 * @mrethod POST
	 * @return callback
	 */
	login(params) {
		return this.post('/admin/login', params).then((response) => {
			this.activateAdministratorAccount(response.data);
			return response;
		});
	}

	activateAdministratorAccount(user) {
		this.AuthService.isAuthenticated = true;
		this.AuthService.user = user;
	}

	clearAdministratorAccount() {
		this.AuthService.isAuthenticated = false;
		this.AuthService.user = null;
	}

	
	all() {
		return this.get('/admin/clients/all', true);
	}

}

export default UserService;