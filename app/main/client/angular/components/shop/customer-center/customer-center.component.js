import customerCenterTemplate from './customer-center.template.html';


class CustomerCenterController {

	constructor() {

	}

	$onInit() {
		
	}

}

export const customerCenterComponent = {
	template: customerCenterTemplate,
	transclude: true,
	controller: CustomerCenterController,
	controllerAs: '$vm',
	bindings: {
		title: '<',
		context: '<'
	}
};

