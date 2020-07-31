
export default function httpInterceptor($injector, $q, $timeout, CONSTANTS) {
	return {
		response(response) {
			return response || $q.when(response);
		},
		responseError(rejection) {
			// if the status of the rejection error is unhandled
			const $state = $injector.get('$state');

			if (rejection.status === -1 || rejection.status === 0) {
				$state.go($state.current, {}, {reload: true});
			} else if (rejection.status === 401) {
				$injector.get('toastr').error(CONSTANTS.ERROR.NOT_LOGIN);
				$state.go('login');
			}

			return $q.reject(rejection);
		}
	};
}

