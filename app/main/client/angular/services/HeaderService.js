

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
		if (angular.isArray(this._shopMenuItems) && this._shopMenuItems.length > 0) {
			return this._shopMenuItems;
		}

		return this.constituteShopMenuRoutes();
	}

	/**
	 * private method
	 * constitue shop menu of  all config routes for shop menu components 
	 */
	constituteShopMenuRoutes() {
		if (angular.isArray(this._shopMenuItems) && this._shopMenuItems.length > 0) {
			return this._shopMenuItems;
		}

		this.$state.get()
			.filter((route) => route.shopMenu)
			.map((route) => {
				let shopItem = {
					title: route.shopMenu.title,
					href: route.name
				};

				if (route.shopMenu.mainSubject) {
					let shopItemMix = angular.extend(shopItem, {shopItems: [], isAdmin: route.isAdmin});
					this._shopMenuItems.push(shopItemMix);
				} else {
					this._shopMenuItems[this._shopMenuItems.length - 1].shopItems.push(shopItem);
				}
			});

		return this._shopMenuItems;
	}


}