/**
 * !!undefined 	=> false
 * !!null		=> false
 * !!""  		=> false
 * !![]			=> true
 * !!"undefined"=> true
 * 
 */
export default function initialization($rootScope, $state, $stateParams, $timeout, EventListener, AuthService, UserService) {	
	// Initialization
	// Determine whether the user is logged in.
	// This will not redirect to login page
	UserService.detectUserIdentity();
	
	AuthService.csrf = {};
	AuthService.setCsrfTokenFromAttribute();
	
	$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {		

		const isHome = toState.name === 'shop.home';
		const isProductOverview = toState.name === 'shop.product.list';
		const isProductDetail = toState.name === 'shop.product.detail';
		const isRegister = toState.name === 'shop.register';
		const isResendEmail = toState.name === 'shop.resend-email';
		const isResetPassword = toState.name === 'shop.reset-password';
		const isSettlePayment = toState.name === 'shop.settle-payment';
		const isAbout = toState.name.indexOf('shop.about') > -1;
		const isService = toState.name.indexOf('shop.service') > -1;
		const isOrder = toState.name.indexOf('shop.user.order') > -1;
		


		if (!isOrder) {
			EventListener.broadcast('isLoading', true);
		}

		EventListener.broadcast('updateShopMenubarIndex', toState.name)
		
		if (isHome || isProductOverview || isProductDetail || isRegister || isResendEmail || isResetPassword || isSettlePayment || isAbout || isService) {
			return;
		}

		// Due to initialization, we need to wait the AuthService fetch the authentication stautus, then determine status of user to redirect.
		$timeout(() => {
			// Filter the page without HTTP request of user authentication.
			if(AuthService.isAuthenticated) {
				// Execute if isAuthenticated is expired 
				return;
			}

			event.preventDefault();
			return $state.go('shop.home');
		}, 1500);

		/**
		 * Cancel http pending request.
		 */
		 // angular.forEach($http.pendingRequests, (request) => {
		 // 	if (request.cancel && request.timeout) {
		 // 		return request.cancel.resolve();
		 // 	}
		 // });

	});

	/**
	 * Rejection manager
	 */
	// $rootScope.$on('$stateChangeError', (event, current, previous, rejection, ...arg) => {
	// 	console.error('stateChangeError', event, current, previous, rejection);
	// });
	
}







