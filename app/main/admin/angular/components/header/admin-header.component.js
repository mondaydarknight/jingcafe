import adminHeaderTemplate from './admin-header.template.html';


class AdminHeaderController {

	constructor($state, $timeout, $window, AuthService, UserService, toastr, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.$timeout = $timeout;
		this.$window = $window;
		this.AuthService = AuthService;
		this.UserService = UserService;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	logout() {
		return this.UserService.logout().then((response) => {
			this.toastr.info(this.CONSTANTS.INFO.LOGOUT);
			this.$window.location.href = '/admin';
		});
	}
}


export const adminHeaderComponent = {
	template: adminHeaderTemplate,
	controller: AdminHeaderController,
	controllerAs: '$vm',
	bindings: {}
};


