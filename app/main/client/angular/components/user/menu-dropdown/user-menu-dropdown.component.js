import userMenuDropdownTemplate from './user-menu-dropdown.template.html';

class UserMenuDropdownController {

	constructor($scope, $state, $templateCache, $sce, AuthService, UserService, toastr, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.AuthService = AuthService;
		this.UserService = UserService;
		this.$templateCache = $templateCache;
		this.$sce = $sce;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.iconUser = this.$sce.trustAsHtml(this.$templateCache.get('icon-user'));
		this.iconUserDocument = this.$sce.trustAsHtml(this.$templateCache.get('icon-user-document'));
		this.iconSignOut = this.$sce.trustAsHtml(this.$templateCache.get('icon-sign-out'));
	}

	logout() {
		this.toastr.info(this.CONSTANTS.INFO.LOGOUT);
		this.UserService.logout().then((response) => this.$state.go('shop.home'));
	}

}


export const userMenuDropdownComponent = {
	template: userMenuDropdownTemplate,
	controller: UserMenuDropdownController,
	controllerAs: '$vm',
	bindings: {}
};



