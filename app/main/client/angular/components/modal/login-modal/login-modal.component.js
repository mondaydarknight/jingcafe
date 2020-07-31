import loginModalTemplate from './login-modal.template.html';

class LoginModalController {

	constructor($scope, $state, $document, $timeout, AuthService, EventListener, UserService, ToolFactory, ErrorHandler, toastr, CONSTANTS) {
		'ngInject';
		
		this.$scope = $scope;
		this.$state = $state;
		this.$document = $document;
		this.$timeout = $timeout;
		this.EventListener = EventListener;
		this.AuthService = AuthService;
		this.UserService = UserService;
		this.ToolFactory = ToolFactory;
		this.ErrorHandler = ErrorHandler;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	/**
	 * The initialization of angular scope
	 */ 
	$onInit() {
		this.backToLogin = this.$document[0].body.querySelector('.back-to-login');
		this.loginWrapper = this.$document[0].body.querySelector('.login-wrapper');
		this.forgetPasswordWrapper = this.$document[0].body.querySelector('.forget-password-wrapper');
		this.alert = { isOpen: false, class: 'danger', message: null };
	}

	$postLink() {
		this.user = {};
		this.isLoading = false;
		this.openLoginWrapper(true);
	}

	cancel() {
		return this.modalInstance.dismiss();
	}

	addSelectorErrorClass(selector) {
		if (this.signIn.hasOwnProperty(selector)) {			
			const $formGroup = this.signIn[selector].$$attr.$$element.parent();

			this.signIn[selector].$$attr.$$element.focus();
			$formGroup.addClass('has-error').on('keyup', (event) => {
				$formGroup.removeClass('has-error').off('keyup');
			});
		}
	}

	alertMessage(message) {
		this._alert.message = message;
	}

	
	openLoginWrapper(isOpen = true, event) {
		/**
		 * Set the password  
		 *
		 * @param object 	wrapperElement
		 * @param bool		isDisplay
		 */
		const _displayWrapper = (wrapperElement, isDisplay) => wrapperElement.style.display = isDisplay ? 'block' : 'none';

		if (event) {
			event.preventDefault();
		}

		_displayWrapper(this.loginWrapper, isOpen);
		_displayWrapper(this.backToLogin, !isOpen);
		_displayWrapper(this.forgetPasswordWrapper, !isOpen);

		if (!isOpen)  {
			this.$timeout(() => this.forgetPasswordWrapper.querySelector('input').focus());
		}

	}

	/**
	 * Send verified email
	 * 
	 * @param account
	 * @return 
	 */
	sendVerifiedEmail() {		
		this.UserService.sendForgetPasswordEmail({account: this.forgetAccount}).then((response) => {}, (error) => {
			console.log(error);
		});
		
		return this.modalInstance.close('sendMail');
	}

	/**
	 * User login process
	 * The deferred and promise handle the response of http
	 * Validate login process
	 */
	login() {
		const buttonSubmit = this.loginWrapper.querySelector('button[type="submit"]');
		const spinner = buttonSubmit.querySelector('.fa-spinner');

		this.alert.isOpen = false;
		
		if (!this.ToolFactory.isAllKeysInObject(['account', 'password'], this.user)) {
			return this.toastr.error(this.CONSTANTS.ERROR.UNKNOWN);
		}

		buttonSubmit.setAttribute('disabled', '');
		spinner.style.display = 'inline-block';

		this.UserService.loginWithCredentials(this.user).then((response) => {
			
			if (response.status === 200) {				
				this.alert.class = 'success';
				this.alert.message = this.CONSTANTS.SUCCESS.LOGIN;
				this.alert.isOpen = true;
				this.$scope.$broadcast('alert', this.alert);
				return this.$timeout(() => this.modalInstance.close(), 1500);
			}
		}, (error) => {					
			/**
			 * Fetch error message and trigger selector of registerForm to add has-error class.
			 */			 
			 if (!error) {
			 	return;
			 }

			error = this.ErrorHandler.parse(error.data.exception[0].message);

			this.alert.message = error.getErrorMessage();
				
			if (error.getErrorCode() === 'UNVERIFED') {
				this.toastr.error(this.CONSTANTS.ERROR.EMAIL_VERIFY);
			}

			error.hasFormGroupElementError() && error.alertByFormGroupElement();

			return this.$scope.$broadcast('alert', this.alert);

			// let errorConfig = error.data.exception && error.data.exception[0].message.split('.');

			// if (!errorConfig || !errorConfig.length) {
			// 	throw new Error('Undefined exception message of error config');
			// }

			// if (errorConfig.length > 1 && this.CONSTANTS[errorConfig[0]] !== undefined) {
				
			// 	let errorDetailConfig = errorConfig[1].split('|');

			// 	if (this.CONSTANTS[errorConfig[0]][errorDetailConfig[0]] !== undefined) {
			// 		if (errorConfig.length > 1) {
			// 			this.alert.message = this.CONSTANTS[errorConfig[0]][errorDetailConfig[0]];
			// 			this.addSelectorErrorClass(errorDetailConfig[1]);						
			// 		} else {
			// 			this.alert.message = this.CONSTANTS[errorConfig[0]][errorDetailConfig[1]];
			// 		}

			// 		return this.$scope.$broadcast('alert', this.alert);
			// 	}
			// 	return this.consoleError(`Undefined error exception: ${errorDetailConfig[1]} in Angular CONSTANTS.`);
			// } else {
			// 	return this.consoleError(`error code: ${error.status}, exception error: ${errorConfig[0]}`);
			// }
		}).finally(() => {
			buttonSubmit.removeAttribute('disabled');
			spinner.style.display = 'none';
			this.alert.isOpen = true;
		});
	}

}


export const loginModalComponent = {
	template: loginModalTemplate,
	controller: LoginModalController,
	controllerAs: '$vm',
	bindings: {
		resolve: '<',
		modalInstance: '<'
	}
};


