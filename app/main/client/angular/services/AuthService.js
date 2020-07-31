// import HttpService from './HttpService';


class AuthService {

	constructor($rootScope, $q, $http, toastr, CONSTANTS) {
		'ngInejct';

		this.$rootScope = $rootScope;
		this.$q = $q;
		this.toastr = toastr;
		this._initAuthenticatedService();
	}

	set isAuthenticated(isAuthenticated) {
		this._isAuthenticated = !!isAuthenticated && isAuthenticated;
	}

	/**
	 * @return boolean|undefined
	 */
	get isAuthenticated() {
		return this._isAuthenticated;
	}

	set csrf(csrf) {
		if (Object.prototype.toString.call(csrf) !== '[object Object]') {
			throw new TypeError('CSRF middleware token was invalid.');
		}

		this._csrf = csrf;
	}

	get csrf() {
		return this._csrf;
	}

	/**
	 * Notice: Ojbect.keys() is ECMAScript 2017, it's not available for IE11 browser
	 * alternative way is using for ( in )...
	 * Object.keys() | Object.values().includes() | arr.some()  
	 */
	set user(user) {
		if (!user || !Object.keys(user).length) {
			return;
		}

		this._user = user;
	}

	get user() {
		return this._user;
	}

	setCsrfTokenFromAttribute() {
		const csrfElement = document.getElementById('csrf');
		
		this.csrf[csrfElement.getAttribute('csrf-name-key')] = csrfElement.getAttribute('csrf-name');
		this.csrf[csrfElement.getAttribute('csrf-value-key')] = csrfElement.getAttribute('csrf-value');
		return this;
	}
	
	_initAuthenticatedService() {
		this.isAuthenticated = false;
	}

}

export default AuthService;