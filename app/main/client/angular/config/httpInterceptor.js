
export default function httpInterceptor($injector, $q, $timeout, CONSTANTS) {
	return {
		response(response) {
			return response || $q.when(response);
		},
		responseError(rejection) {
			// if the status of the rejection error is unhandled
			if (rejection.status === -1 || rejection.status === 0) {
				$injector.get('$state').reload();
			} else if (rejection.status === 401) {
				$injector.get('AuthService').isAuthenticated = false;
				$injector.get('toastr').error(CONSTANTS.ERROR.NOT_LOGIN);
				$injector.get('$state').go('shop.home', {isOpenLoginModal: true});
			}

			return $q.reject(rejection);
		}
	};
}

