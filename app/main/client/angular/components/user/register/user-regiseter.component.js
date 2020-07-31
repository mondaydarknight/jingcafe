import userRegisterTemplate from './user-register.template.html';

class UserRegisterController {

	constructor($state, $timeout, EventListener, AuthService, ShopService, UserService, ToolFactory, toastr, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.$timeout = $timeout;
		this.EventListener = EventListener;
		this.AuthService = AuthService;
		this.ShopService = ShopService;
		this.UserService = UserService;
		this.ToolFactory = ToolFactory;
		this.debounce = ToolFactory.debounce();
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.initUserRegisterService();
	}

	$postLink() {
		this.user = {};
		this.isLoading = false;
		this.error = null;
		this.$alert = angular.element(document.querySelector('span[type="alert"]'));
	}

	set user(user) {
		this._user = user;
	}	

	get user() {
		return this._user;
	}

	initUserRegisterService() {
		// Determine whether the user is exist.
		if (this.AuthService.isAuthenticated) {
			this.toastr.error(this.CONSTANTS.ERROR.USER_ALREADY_EXIST);
			return this.$state.go('shop.home');
		}

	}

	alertErrorNotification(selector) {
		this.addErrorOnFormSelector(selector);
		this.$alert.fadeIn(() => this.$alert.addClass('alert-danger'));
		this.debounce(() => this.$alert.removeClass('alert-danger'), 1500);
	}

	/**
	 * Find the error of registerForm's selector and add has-error class
	 *
	 */
	addErrorOnFormSelector(selector) {
		if (this.registerForm.hasOwnProperty(selector)) {
			const $parentSelector = this.registerForm[selector].$$attr.$$element.parent();

			this.registerForm[selector].$$attr.$$element.focus();
			$parentSelector.addClass('has-error').on('keyup', ($event) => {
				$parentSelector.removeClass('has-error');
				$parentSelector.off('keyup');
			});
		}
	}

	/**
	 * For security reasons,
	 * Exclude other access methods from server request. Only Website process entry.
	 * Add the spiderspam key/value for HTTP register request
	 * It's hidden on the main page and must be submitted with its default value for this to be processed.
	 */
	addVerifySpiderSpam() {
		return angular.extend(this.user, {spiderSpam: 'http://'});
	}

	/**
	 * Register information of user
	 * First determine whether the value in object 
	 * 
	 * 
	 */
	register() {
		const fillableColumns = ['sex', 'account', 'password', 'phone'];
		this.isLoading = true;
		this.error = null;
		this.EventListener.broadcast('isLoading', true);


		if (!this.ToolFactory.isAllKeysInObject(fillableColumns, this.user)) {
			return;
		}

		this.addVerifySpiderSpam();

		this.UserService.register(this.user).then((response) => {
			// If the status of result is success, redirect to mail website
			this.ShopService.isOpenLoginModal = true;
			this.toastr.success(this.CONSTANTS.SUCCESS.REGISTER);
			return this.$timeout(() => this.$state.go('shop.resend-email', {userId: response.data}), 500);
		}, (error) => {
			 if (error.status === 403) {
			 	this.toastr.error(this.CONSTANTS.CREDENTIAL);
			 	return this.$timeout(() => this.$state.go('shop.home'), 500);
			 } 

			/**
			 * Fetch error message and trigger selector of registerForm to add has-error class.
			 */
			let errorConfig = error.data.exception && error.data.exception[0].message.split('.');

			if (!errorConfig || !errorConfig.length) {
				throw new Error('Undefined exception message of error config');
			}

			if (errorConfig.length > 1 && this.CONSTANTS.hasOwnProperty(errorConfig[0])) {
				
				let errorDetailConfig = errorConfig[1].split('|');

				if (this.CONSTANTS[errorConfig[0]].hasOwnProperty(errorDetailConfig[0])) {
					if (errorConfig.length > 1) {
						this.error = this.CONSTANTS[errorConfig[0]][errorDetailConfig[0]];
						return this.alertErrorNotification(errorDetailConfig[1]);
					}

					return this.error = this.CONSTANTS[errorConfig[0]][errorDetailConfig[1]];
				} 
				return this.ToolFactory.consoleError(`Undefined error exception: ${errorDetailConfig[1]} in Angular CONSTANTS.`);
			} else {
				return this.ToolFactory.consoleError(`error code: ${error.status}, exception error: ${errorConfig[0]}`);
			}

		}).finally(() => {
			this.isLoading = false;
			this.EventListener.broadcast('isLoading', false);
		});
	}

}


export const userRegisterComponent = {
	template: userRegisterTemplate,
	controller: UserRegisterController,
	controllerAs: '$vm',
	bindings: {
		product: '<'
	}
};

