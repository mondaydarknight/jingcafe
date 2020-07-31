import productInterfaceTemplate from './product-interface.template.html';


class ProductInterfaceController {

	constructor($window, $scope, $state, CONSTANTS) {
		'ngInject';

		this.$window = $window;
		this.$scope = $scope
		this.$state = $state;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.isActiveId = 0;
		this.categories = this.shopBase.shop.categories;
		this.listenProductListUrl();
	}
		
	listenProductListUrl() {
		this.$scope.$on('$stateChangeSuccess', (event, toState, toParams) => {
			if (toState.name === 'shop.product.list' && toParams.productCategory) {	
				let matchIndex = null;

				for (let i=0; i<this.categories.length; i++) {
					if (this.categories[i].uri === toParams.productCategory) {
						matchIndex = i;
						break;
					}
				}

				if (typeof matchIndex === 'number') {
					this.isActiveId = matchIndex;
				}	
			}
		});
	}

	/**
	 * Store one of product info to product detail page.
	 * object 	product
	 */
	set product(product) {
		if (!angular.isObject(product)) {
			throw new Error(this.CONSTANTS.ERROR.OBJECT);
		}

		if (!product.hasOwnProperty('id')) {
			throw new Error(`Undefined product id in product. Check your product setting is correct`);
		}
		
		this._product = product;
	}

	get product() {
		return this._product;
	}

}

export const productInterfaceComponent = {
	require:{
		shopBase: '^'
	},
	template: productInterfaceTemplate,
	controller: ProductInterfaceController,
	controllerAs: '$vm',
	bindings: {}
};

