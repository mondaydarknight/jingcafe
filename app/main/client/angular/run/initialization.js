

export default function initialization($rootScope, $state, Authentication) {
	'ngInject';

	
	$rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
		// const isHomePaeg = toState.name === 'shop.home';
		// const isRegisterPage = toState.name === 'shop.register';
		const isProductListPage = toState.name === 'shop.product.list';


		if (isProductListPage) {
			if (toParams.productCategory) {
				return;
			}

			event.preventDefault();
			return $state.go('shop.product.list', {productCategory: 'coffee_bean'});
		}


		// The authentication of user when routing every single page application. 
		
	});
	
}