import shopBaseTemplate from './shop-base.template.html';


class ShopBaseController {

	constructor() {
		'ngInject';


	}

	$onInit() {
		
	}

	set shopInfo(shopInfo) {
		if (!shopInfo || shopInfo.status !== 200) {
			console.error(shopInfo.data.exception[0].message || CONSTANTS.ERROR.UNKNOWN);
			toastr.error(CONSTANTS.ERROR.UNKNOWN);
			return $timeout($state.go('shop.home'), 700);
		}

		this._shopInfo = shopInfo.data;
	}
	
	get shopInfo() {
		return this._shopInfo;
	} 

}


export const shopBaseComponent = {
	template: shopBaseTemplate,
	controller: ShopBaseController,
	controllerAs: '$vm',
	bindings: {
		shopInfo: '='
	}
};