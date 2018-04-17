
export default class HttpService {
	constructor($http, CONSTANTS) {
		this.$http = $http;
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
			timeout: this.CONSTANTS.HTTP.REQUEST_TIMEOUT
		});
	}

	post(operation, params) {
		return this.$http.post(operation, params);
	}

	put(operation, params) {
		return this.$http.put(operation, params);
	}

	delete(operation, params) {
		return this.$http.delete(operation, params);
	}

	upload() {
		
	}

}


