import userCheckoutTemplate from './user-checkout.template.html';

class UserCheckoutController {

	constructor($rootScope, $scope, $state, $document, $timeout, $uibModal, EventListener, ToolFactory, CookieFactory, ErrorHandler, toastr, CONSTANTS) {
		'ngInject';

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
		this.$document = $document;
		this.$timeout = $timeout;
		this.$uibModal = $uibModal;
		this.EventListener = EventListener;
		this.ToolFactory = ToolFactory;
		this.timeController = ToolFactory.TimeController();
		this.CookieFactory = CookieFactory;
		this.ErrorHandler = ErrorHandler;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
		
	}

	$onInit() {
		this.params = {
			products: {}, 
			logistic: {}, 
			payment: {}, 
		};
	}

	/**
	 * @access public
	 */
	checkout() {
		this.params.products = this.products;
		this.params.totalPrice = this.params.productTotalPrice + parseInt(this.params.logistic.fee, 10);

		const checkoutModalInstance = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'checkoutModal',
			size: 'lg',
			resolve: {
				checkoutParams: () => this.params
			}
		});

		checkoutModalInstance.result.then((response) => {					
			this.EventListener.broadcast('refreshUserCartProducts', [], true);
			this.toastr.success(this.CONSTANTS.SUCCESS.CHECKOUT);
			return this.$timeout(() => this.$state.go('shop.user.order.list'));
		}, (error) => {
			if (!error.data) {
				return;
			}
			const errorHandler = this.ErrorHandler.parse(error.data.exception[0].message);
			
			errorHandler.alertByToast();
			
			if (errorHandler.hasFormGroupElementError()) {
				this.params.logistic.hasOwnProperty(errorHandler.getElementName()) && this.$scope.$broadcast('selectVerificationTab', 1);				
				errorHandler.alertByFormGroupElement();
			}
			
		});
	
	}



	set user(user) {
		// const userNecessaryColumns = ['username', 'account', 'phone'];
		// if (this.isAllKeysInObject(userNecessaryColumns, user)) {
		// }
		this._user = user;
	}

	get user() {
		return this._user;
	}

	set products(products) {
		if (!products || !products.length) {
			this._products = [];
			return this.ToolFactory.consoleError(`Cannot read property products of undefined`);
		}

		this._products = products;
	}

	get products() {
		return this._products;
	}

	set logistics(logistics) {
		if (!logistics || !logistics.length) {
			return this._logistics = [];
		}

		logistics.forEach((logistic) => {			
			logistic.profile = this.CONSTANTS.ASSETS.LOGISTICS_PATH + logistic.profile;
			logistic = this.ToolFactory.convertToCamelCase(logistic);
		});

		this._logistics = logistics;
	}

	get logistics() {
		return this._logistics;
	}

	set payments(payments) {
		this._payments = payments || [];
	}

	get payments() {
		return this._payments;
	}

}



export const userCheckoutComponent = {
	require: {
		shopBase:'^^'
	},
	template: userCheckoutTemplate,
	controller: UserCheckoutController,
	controllerAs: '$vm',
	bindings: {
		user: 	'<',
		products: '<',
		counties: '<',
		logistics: '<',
		payments: '<',
		userLogistic: '<',
		userPayment: '<'
	}
};




