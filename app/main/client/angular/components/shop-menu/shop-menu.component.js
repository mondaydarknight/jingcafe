import shopMenuTemplate from './shop-menu.template.html';


class ShopMenuController {

	constructor($scope, $state, $element, Authentication, HeaderService, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.$element = $element;
		this.Authentication = Authentication;
		this.HeaderService = HeaderService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {		
		this.shopMenuItems = this.HeaderService.shopMenuItems;
		this.initMobileMenuCollapse();
	}

	$postLink() {
		this.menuCollapsed = false;
		this.menuIndexActive = 0;
		this.isAuthenticated = this.Authentication.isAuthenticated;
	}

	set shopMenuItems(shopMenuItems) {
		if (!angular.isArray(shopMenuItems)) {
			return this._shopMenuItems = [];
		}

		this._shopMenuItems = shopMenuItems;
	}

	get shopMenuItems() {
		return this._shopMenuItems;
	}

	set menuCollapsed(menuCollapsed) {
		this._menuCollapsed = !!menuCollapsed && menuCollapsed;
	}

	get menuCollapsed() {
		return this._menuCollapsed;
	}

	set menuIndexActive(menuIndexActive) {
		if (isNaN(menuIndexActive)) {
			throw new Error(this.CONSTANTS.ERROR.NUMBER);
		}

		this._menuIndexActive = menuIndexActive;
	}

	get menuIndexActive() {
		return this._menuIndexActive;
	}

	initMobileMenuCollapse() {
		const $mobileShopMenuToggler = this.$element.find('ul.navbar-nav');
		this.$scope.$watch(() => this.menuCollapsed, (isCollapsed) => {
			isCollapsed ? $mobileShopMenuToggler.slideUp() : $mobileShopMenuToggler.slideDown();
		});
	}

	switchMenuInterface($event, menu, $mainMenuIndex) {
		$event.preventDefault();

		// Identify the menu's url is correct.
		if (!menu.hasOwnProperty('href')) {
			throw new Error(this.CONSTANTS.ERROR.URL_NOT_FOUND);
		}

		if (angular.isUndefined(menu.shopItems) || menu.shopItems.length == 0) {
			this.menuIndexActive = $mainMenuIndex;
			return this.$state.go(menu.href);
		}
	}

}


export const shopMenuComponent = {
	template: shopMenuTemplate,
	controller: ShopMenuController,
	controllerAs: '$vm',
	bindings: {}
};

