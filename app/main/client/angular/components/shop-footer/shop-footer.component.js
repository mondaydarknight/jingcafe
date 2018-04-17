import shopFooterTemplate from './shop-footer.template.html';


class ShopFooterController {

	constructor() {

	}

	$onInit() {
		// Initialize the parent scope info 
		this.shopInfo = this.parent.shopInfo;
	}

	$postLink() {

	}

}

export const shopFooterComponent = {
	require: {
		parent: '^^shopBase'
	},
	template: shopFooterTemplate,
	controller: ShopFooterController,
	controllerAs: '$vm',
	bindings: {}
};


