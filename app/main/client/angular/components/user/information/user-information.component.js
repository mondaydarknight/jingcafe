import userInformationTemplate from './user-information.template.html';

class UserInformationController {

	constructor($sce, $templateCache, AuthService, UserService, ErrorHandler, toastr, CONSTANTS) {
		'ngInject';

		this.$sce = $sce;
		this.$templateCache = $templateCache;
		this.AuthService = AuthService;
		this.UserService = UserService;
		this.ErrorHandler = ErrorHandler;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.iconUser = this.$sce.trustAsHtml(this.$templateCache.get('icon-user'));
		this.user = this.AuthService.user;
	}

	updateUser() {
		return this.UserService.updateInfo(this.user).then((response) => {
			this.toastr.success(this.CONSTANTS.SUCCESS.SETTING);
		}, (error) => {
			error = this.ErrorHandler.parse(error);

			if (error.hasFormGroupElementError()) {
				error.alertByFormGroupElement();
			}

			if (error.hasToastError) {
				error.alertByToast();
			}
		});
	}
	
}	


export const userInformationComponent = {
	template: userInformationTemplate,
	controller: UserInformationController,
	controllerAs: '$vm',
	bindings: {}
};



