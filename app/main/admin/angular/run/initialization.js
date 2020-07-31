

export default function initialization($rootScope, $state, EventListener, AuthService, UserService) {

	AuthService.csrf = {};
	AuthService.setCsrfTokenFromAttribute();
	
	$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
		EventListener.broadcast('isLoaderActive', true);
	
		const isLogin = toState.name === 'login';

		if (isLogin) {
			return AuthService.isAuthenticated && event.preventDefault();
		}

		if(AuthService.isAuthenticated) {
			// Execute if isAuthenticated is expired 
			return;
		}

		// Ignore or overlook the url that don't need to isLoggedIn
		event.preventDefault();
		return UserService.isLoggedIn().then((response) => {
			if (response.status === 200) {
				return $state.go(toState.name);
			}

			EventListener.broadcast('isLoaderActive', false);
		});
	});

}

