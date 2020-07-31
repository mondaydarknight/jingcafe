import adminLayoutTemplate from './admin-layout.template.html';

class AdminLayoutController {

	constructor(SidebarService, OrderService) {
		'ngInject';

		this.SidebarService = SidebarService;
	}
	
	set shop(shop) {
		this._shop = shop;
	}

	get shop() {
		return this._shop;
	}
}


export const adminLayoutComponent = {
	template: adminLayoutTemplate,
	controller: AdminLayoutController,
	controllerAs: '$vm',
	bindings: {
		shop: '<'
	}
};


