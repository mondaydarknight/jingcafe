import shopMenubarTemplate from './shop-menubar.template.html';

class ShopMenubarController {

	constructor($scope, $state, EventListener, AuthService, HeaderService, CONSTANTS) {
		'ngInject';

		this.menuExtension = [
			{
				column: 'categories',
				name: 'product',
				url: 'shop.product.list',
				link: 'productCategory'
			}
		];

		this.$scope = $scope;
		this.$state = $state;
		this.EventListener = EventListener;
		this.AuthService = AuthService;
		this.HeaderService = HeaderService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.shopMenuItems = this.HeaderService.shopMenuItems;
		this.EventListener.on('updateShopMenubarIndex', this.updateShopMenubarIndex, this);
		this.extendShopMenuItems();
	}

	extendShopMenuItems() {
		if (!this.menuExtension.length) {
			return;
		}

		// console.log(this.shopMenuItems);
		let extension = this.menuExtension;

		for (let key in extension) {
			if (this.shopBase.shop[extension[key].column] && this.shopBase.shop[extension[key].column].length) {
				let menuKey = this.findMenu(extension[key].name);

				if (typeof menuKey !== 'number') {
					return;
				}

				this.shopMenuItems[menuKey].shopItems = new Array();

				this.shopBase.shop[extension[key].column].forEach((item) => {
					let linkArguments = {};

					linkArguments[extension[key].link] = item.uri;

					let menuItem = {
						title: item.name,
						href: extension[key].url,
						arguments: linkArguments,
						mainSubject: false
					};

					this.shopMenuItems[menuKey].shopItems.push(menuItem);
				});
			}
		}		
	}

	findMenu(key) {
		let menuIndex;

		for (let i=0; i<this.shopMenuItems.length; i++) {
			if (this.shopMenuItems[i].name.indexOf(key) > -1) {
				menuIndex = i;
				break;
			}
 		}

 		return menuIndex;
	}

	updateShopMenubarIndex(href) {
		let isMenuItemHref = false;

		for (let i=0; i<this.shopMenuItems.length; i++) {
			for (let j=0; j<this.shopMenuItems[i].shopItems.length; j++) {
				if (this.shopMenuItems[i].shopItems[j].href.indexOf(href) > -1) {
					isMenuItemHref = true;
					this.expandedMenuId = i;
					this.selectedMenuId = j;
					this.$scope.$$phase && this.$scope.$digest();
					break;
				}
			}
		}

		if (!isMenuItemHref) {
			this.expandedMenuId = undefined;
			this.selectedMenuId = undefined;
		}
	}

	directToMenuPage(event, parentMenuIndex, childMenuIndex) {
		event.preventDefault();

		if (!this.shopMenuItems[parentMenuIndex] || !this.shopMenuItems[parentMenuIndex].shopItems[childMenuIndex]) {
			throw new Error('Empty index of parentMenuIndex or childMenuIndex in shopMenuItems.');
		}

		this.expandedMenuId = parentMenuIndex;
		this.selectedMenuId = childMenuIndex;

		let link = this.shopMenuItems[parentMenuIndex].shopItems[childMenuIndex];

		return this.$state.go(link.href, link.arguments);
	}

}

export const shopMenubarComponent = {
	require: {
		shopBase: '^'
	},
	template: shopMenubarTemplate,
	controller: ShopMenubarController,
	controllerAs: '$vm',
	bindings: {}
};



