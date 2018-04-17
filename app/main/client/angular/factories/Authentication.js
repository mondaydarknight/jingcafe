
export default class Authentication {

	constructor($rootScope, $state, $q, toastr, HttpService) {
		'ngInejct';

		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$q = $q;
		this.toastr = toastr;
		this.HttpService = HttpService;

		this.initAuthenticatedService();
	}

	set isAuthenticated(isAuthenticated) {
		this._isAuthenticated = !!isAuthenticated && isAuthenticated;
	}

	get isAuthenticated() {
		return this._isAuthenticated;
	}

	set user(user) {
		if (!user || user.length <= 0) {
			return this._user = null;
		}

		this._user = user;
	}

	get user() {
		return this._user;
	}

	initAuthenticatedService() {
		this.isAuthenticated = false;
		this.user = null;
	}


	static setup() {
		return new Authentication(...arguments);
	}

}

Authentication.$inejct = ['$rootScope', '$state', '$q', 'toastr', 'HttpService'];