
class AuthService {

	constructor(ToolFactory) {
		'ngInject';
		
		this.ToolFactory = ToolFactory;
	}
	
	set isAuthenticated(isAuthenticated) {
		if (!this.ToolFactory.isBoolean(isAuthenticated)) {
			throw new Error('Data type error. isAuthenticated is not Boolean type.');
		}
		
		this._isAuthenticated = !!isAuthenticated;
	}

	get isAuthenticated() {
		return this._isAuthenticated;
	}

	set user(user) {
		this._user = user;
	}

	get user() {
		return this._user;
	}
	
	set csrf(csrf) {
		if (!angular.isObject(csrf)) {
			throw new TypeError('Undefined or unknown type of csrf.');
		}

		this._csrf = csrf;
	}

	get csrf() {
		return this._csrf;
	}

	setCsrfTokenFromAttribute() {
		const csrfElement = document.getElementById('csrf');

		if (!this.csrf) {
			throw new Error('Unknown variable of csrf.');
		}

		this.csrf[csrfElement.getAttribute('csrf-name-key')] = csrfElement.getAttribute('csrf-name');
		this.csrf[csrfElement.getAttribute('csrf-value-key')] = csrfElement.getAttribute('csrf-value');
	} 

}

export default AuthService;