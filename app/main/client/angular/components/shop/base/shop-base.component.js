import shopBaseTemplate from './shop-base.template.html';


class ShopBaseController {

	constructor($state, toastr, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}
	
	set shop(shop) {
		this._shop = shop;
	}
	
	get shop() {
		return this._shop;
	} 

}


export const shopBaseComponent = {
	template: shopBaseTemplate,
	controller: ShopBaseController,
	controllerAs: '$vm',
	bindings: {
		shop: '<'
	}
};