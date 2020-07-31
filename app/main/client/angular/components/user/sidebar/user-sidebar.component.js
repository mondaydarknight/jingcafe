import userSidebarTemplate from './user-sidebar.template.html';

class UserSidebarController {

	constructor(AuthService) {
		'ngInject';

		this.AuthService = AuthService;
	}

	$onInit() {

	}


}

export const userSidebarComponent = {
 	template: userSidebarTemplate,
 	controller: UserSidebarController,
 	controllerAs: '$vm',
 	bindings: {}
};
