import userInterfaceTemplate from './user-interface.template.html';

class UserInterfaceController {

	constructor() {
		'ngInject';

		
	}

	$onInit() {
		
	}


}

export const userInterfaceComponent = {
	template: userInterfaceTemplate,
	controller: UserInterfaceController,
	controllerAs: '$vm',
	bindings: {}
};
