
export default class HttpInterceptor {

	constructor($q) {
		'ngInject';

		this.$q = $q;
	}

	response(response) {
		return response || this.$q.when(response);
	}

	/**
	 * Attach every request with catch method in order to handle error response
	 */
	responseError(rejection) {
		// if (rejection.status === 401) {
			// redirect to home page

		// }
	
		return this.$q.reject(rejection);
	}

	static setup() {
		return new HttpInterceptor(...arguments);
	}

}

HttpInterceptor.setup.$inject = ['$q'];


