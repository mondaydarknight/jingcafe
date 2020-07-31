import shopFooterTemplate from './shop-footer.template.html';


class ShopFooterController {

	constructor($window, HeaderService, CONSTANTS) {
		'ngInject';

		this.$window = $window;
		this.HeaderService = HeaderService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		// Initialize the parent scope info 
		this.shopMenuItems = this.HeaderService.shopMenuItems.filter((menuItem) => typeof menuItem.isAdmin === 'undefined');
	}

	directToAdminPage() {
		return this.$window.open(this.CONSTANTS.URL.LOCAL.ADMIN);
	}

}

export const shopFooterComponent = {
	require: {
		shopBase: '^^'
	},
	template: shopFooterTemplate,
	controller: ShopFooterController,
	controllerAs: '$vm',
	bindings: {}
};


