import paginationTemplate from './pagination.component';

class PaginationController {

	constructor() {
		'ngInject';
		
	}

	$onInit() {
		
	}

	$postLink() {

	}

}

export const paginationComponent = {
	template: paginationTemplate,
	controller: PaginationController,
	controllerAs: '$vm',
	bindings: {}
};

