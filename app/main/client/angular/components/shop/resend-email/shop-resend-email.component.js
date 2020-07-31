import shopResendEmailTemplate from './shop-resend-email.template.html';

class ShopResendEmailController {

	constructor($state, $stateParams, toastr, UserService, EventListener, CONSTANTS) {
		'ngInject';
		
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.toastr = toastr;
		this.UserService = UserService;
		this.EventListener = EventListener;
		this.CONSTANTS = CONSTANTS;
	}

	resendEmailVerification() {
		this.toastr.success(this.CONSTANTS.SUCCESS.SEND_EMAIL);

		this.UserService.resendAccountMail(this.$stateParams).then((response) => {}, (error) => {
			this.toastr.error(this.CONSTANTS.ERROR.OCCUR);
			this.$state.go('shop.home');
			throw new Error(error.data.exception[0].message);
		});
	}

}

export const shopResendEmailComponent = {
	template: shopResendEmailTemplate,
	controller: ShopResendEmailController,
	controllerAs: '$vm',
	bindings: {}
};
