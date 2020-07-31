

export default class HeaderService {

	constructor($state) {
		'ngInject';

		this._shopMenuItems = [];
		this.$state = $state;
	}

	set shopMenuItems(shopMenuItems) {
		if (!angular.isArray(shopMenuItems) || shopMenuItems.length <= 0) {
			return;
		}

		this._shopMenuItems = shopMenuItems;
	}

	get shopMenuItems() {
		if (this._shopMenuItems && this._shopMenuItems.length) {
			return this._shopMenuItems;
		}

		return this.constituteShopMenuRoutes();
	}

	/**
	 * private method
	 * constitue shop menu of  all config routes for shop menu components 
	 */
	constituteShopMenuRoutes() {
		this.$state.get()
			.filter((route) => route.shopMenu)
			.map((route) => {
				let shopItem = {
					name: route.shopMenu.name,
					title: route.shopMenu.title,
					href: route.name,
					icon: route.shopMenu.icon
				};
				
				if (route.shopMenu.mainSubject) {
					let shopItemMix = angular.extend(shopItem, {shopItems: [], isAdmin: route.isAdmin});
					this._shopMenuItems.push(shopItemMix);
				} else {
					angular.extend(shopItem, {subMenu: true});
					this._shopMenuItems[this._shopMenuItems.length - 1].shopItems.push(shopItem);
				}
			});

		return this._shopMenuItems;
	}


}