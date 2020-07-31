import adminLoginTemplate from './admin-login.template.html';

class AdminLoginController {

	constructor($state, $document, $timeout, EventListener, UserService, toastr, CONSTANTS) {
		'ngInject';
	
		this.$state = $state;	
		this.$document = $document;
		this.$timeout = $timeout;
		this.EventListener = EventListener;
		this.UserService = UserService;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.admin = {};		

		this.submitElement = this.$document[0].body.querySelector('[type="submit"]');
		this.$alert = angular.element(this.$document[0].body.querySelector('[type="alert"]'));		
		this.$loginFormContent = this.$alert[0].nextElementSibling || this.$alert[0].nextSibling;
		
		this.submitElement.querySelector('.fa-spinner').style.display = 'none';
		this.EventListener.broadcast('isLoaderActive', false);
	}

	displayAlertWarning(isDisplay = false, type, message)
	{
		if (!isDisplay) {
			return this.$alert.hide();
		}

		if (!type || !message) {
			return;
		}

		type = type.toUpperCase();

		this.$alert[0].classList = `text-center alert ${this.CONSTANTS.ALERT[type].CLASS}`;
		this.$alert[0].innerHTML = `<i class="${this.CONSTANTS.ALERT[type].ICON}"></i> ${message}`;
		this.$alert.slideDown();
	}

	addSelectorErrorClass(selector) {
		const input = this.$loginFormContent.querySelector(`input[name="${selector}"]`);
		const formGroup = input.closest('div.form-group');
		const addFormGroupError = (event) => {
			formGroup.classList.remove('has-error');
			formGroup.removeEventListener('keydown', addFormGroupError);
		};

		input.focus();
		formGroup.classList.add('has-error');
		formGroup.addEventListener('keydown', addFormGroupError);
	}

	login() {
		const spinner = this.submitElement.querySelector('.fa-spinner');

		this.submitElement.classList.add('disabled');
		spinner.style.display = 'inline-flex';
		this.displayAlertWarning();

		this.UserService.login(this.admin).then((response) => {
			this.displayAlertWarning(true, 'success', this.CONSTANTS.SUCCESS.LOGIN);
			return this.$timeout(() => this.$state.go('admin.home.index'), 1500);
		}, (error) => {
			if (!error.data.exception[0].message) {
				throw new Error('Unknown error exception.');
			}

			let errorConfig = error.data.exception[0].message.split('.');

			if (errorConfig.length == 1 || !this.CONSTANTS[errorConfig[0]]) {
				throw new Error(errorConfig[0]);
			}

			let errorConfigDetail = errorConfig[1].split('|');
			
			if (!this.CONSTANTS[errorConfig[0]][errorConfigDetail[0]]) {
				throw new Error(`Undefined variable column ${errorConfig[0]} and ${errorConfigDetail} in CONSTANTS`);
			}

			if (errorConfigDetail.length > 1) {
				this.addSelectorErrorClass(errorConfigDetail[1]);
			}
			
			return this.displayAlertWarning(true, 'danger', this.CONSTANTS[errorConfig[0]][errorConfigDetail[0]]);
		})
		.finally(() => {
			this.submitElement.classList.remove('disabled');
			spinner.style.display = 'none';
		});

	}

}

export const adminLoginComponent = {
	template: adminLoginTemplate,
	controller: AdminLoginController,
	controllerAs: '$vm',
	bindings: {}
};




