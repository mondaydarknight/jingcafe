import resetPasswordTemplate from './shop-reset-password.template.html';


class ResetPasswordController {

	constructor($window, $state, $stateParams, $document, $timeout, EventListener, UserService, ErrorHandler, toastr, CONSTANTS) {
		'ngInject';

		this.$window = $window;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$document = $document;
		this.$timeout = $timeout;
		this.EventListener = EventListener;
		this.UserService = UserService;
		this.ErrorHandler = ErrorHandler;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		if (!this.$stateParams.userId || !this.$stateParams.secretKey) {
			return this.$state.go('shop.home');
		}

		this.userId = this.$stateParams.userId;
		this.secretKey = this.$stateParams.secretKey;
		this.spinner = this.$document[0].body.querySelector('.fa-spinner');
	}

	set userId(userId) {
		this._userId = parseInt(userId, 10);
	}

	get userId() {
		return this._userId;
	}

	set secretKey(secretKey) {
		this._secretKey = secretKey.toString();
	}

	get secretKey() {
		return this._secretKey;
	}

	resetPassword() {
		const resetPasswordParams = {
			userId: this.userId,
			secretKey: this.secretKey,
			password: this.password
		};

		this.spinner.style.display = 'inherit';
		this.UserService.resetPassword(resetPasswordParams).then((response) => {
			this.toastr.success(this.CONSTANTS.SUCCESS.SETTING);
			
			return this.$timeout(() => {
				this.$state.go('shop.home', {isOpenLoginModal: true});
			}, 1000);
		}, (error) => {
			error = this.ErrorHandler.parse(error.data.exception[0].message);

			if (error.hasFormGroupElementError()) {
				error.alertByToast();
				return error.alertByFormGroupElement();
			}

			if (error.hasToastError) {
				error.alertByToast();				
			} else {
				this.toastr.error(this.CONSTANTS.ERROR.OCCUR);
				error.alertByConsole();
			}

			return this.$state.go('shop.home');
		})
		.finally(() => this.spinner.style.display = 'none');
	}
}


export const shopResetPasswordComponent = {
	template: resetPasswordTemplate,
	controller: ResetPasswordController,
	controllerAs: '$vm',
	bindings: {}
};
	
