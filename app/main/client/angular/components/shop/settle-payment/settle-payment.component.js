import settlePaymentTemplate from './settle-payment.template.html';

class settlePaymentController {

	constructor($state, $stateParams, $document, EventListener, ErrorHandler, AuthService, UserService, CONSTANTS, toastr) {
		'ngInject'; 

		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$document = $document;
		this.AuthService = AuthService;
		this.EventListener = EventListener;
		this.ErrorHandler = ErrorHandler;
		this.UserService = UserService;
		this.CONSTANTS = CONSTANTS;
		this.toastr = toastr;
	}

	$onInit() {
		this.payment = {};
		if (!this.AuthService.isAuthenticated) {
			this.toastr.error(this.CONSTANTS.ERROR.NOT_LOGIN);
			this.EventListener.broadcast('openLoginModal');		
		}
	}

	settlePayment() {
		this.EventListener.broadcast('isLoading', true);
		angular.extend(this.payment, this.$stateParams);
		
		this.UserService.settlePayment(this.payment).then(() => {
			this.toastr.success(this.CONSTANTS.SUCCESS.UPLOAD);
			this.$state.go('shop.user.order.list');
		}, (error) => {
			if (!error.status) {
				return;
			}

			error = this.ErrorHandler.parse(error.data.exception[0].message);
			
			if (error.hasFormGroupElementError()) {
				error.alertByToast();
				error.alertByFormGroupElement();
			} else {
				// error.alertByConsole();
				this.toastr.error(this.CONSTANTS.ERROR.OCCUR);
				this.$state.go('shop.home');
			}			
		})
		.finally(() => this.EventListener.broadcast('isLoading', false));
	}
	

}

export const settlePaymentComponent = {
	template: settlePaymentTemplate,
	controller: settlePaymentController,
	controllerAs: '$vm',
	bindingS: {}
};
