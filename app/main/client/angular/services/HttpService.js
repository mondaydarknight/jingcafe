
export default class HttpService {
	constructor($http, AuthService, CONSTANTS) {
		'ngInject';

		this.$http = $http;
		this.AuthService = AuthService
		this.CONSTANTS = CONSTANTS;
	}

	get(operation, params = {}, isCache = false) {
		if (params === true) {
			params = {};
			isCache = true;
		}

		return this.$http({
			url: operation,
			method: 'GET',
			params: params,
			paramSerializer: '$httpParamSerializerJQLike',
			// timeout: this.CONSTANTS.HTTP.REQUEST_TIMEOUT
		});
	}

	post(operation, params = {}) {
		params = this._extendCsrfParameters(params);
		return this.$http.post(operation, params);
	}

	put(operation, params = {}) {
		params = this._extendCsrfParameters(params);
		return this.$http.put(operation, params);
	}

	delete(operation, params = {}) {
		params = this._extendCsrfParameters(params);
		return this.$http.delete(operation, params);
	}

	_extendCsrfParameters(params) {
		return angular.extend(params, this.AuthService.csrf);
	}



}


