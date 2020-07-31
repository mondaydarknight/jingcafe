import userCartTemplate from './user-cart.template.html';

class UserCartController {

	constructor($rootScope, $scope, $state, EventListener, CookieFactory) {
		'ngInject';

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
		this.EventListener = EventListener;
		this.CookieFactory = CookieFactory;

	}

	set products(products) {
		this._products = products;
	}

	get products() {
		return this._products;
	}

	set hasProduct(hasProduct) {
		this._hasProduct = hasProduct;
	}

	get hasProduct() {
		return this._hasProduct;
	}

	$onInit() {
		const products = this.loadProductFromCookie();
		
		this.registerUserCartService();
		this.refreshUserCartProducts(products);
	}

	registerUserCartService() {
		this.EventListener.on('refreshUserCartProducts', this.refreshUserCartProducts, this);
	}


	/**
	 * Get the products of COOKIE from browser
	 * @access public
	 */
	loadProductFromCookie() {
		return this.CookieFactory.get('products');
	}

	/**
	 * Refresh the products and store in COOKIE 
	 * 
	 * @param array[mixed] 	products
	 * @param bool 			isLoadFromCookie
	 */
	refreshUserCartProducts(products = [], isStoreInCookie = false) {
	 	if (!Array.isArray(products)) {
	 		return;
	 	}

	 	isStoreInCookie && this.CookieFactory.set('products', products);

	 	products = this.produceCartElements(products);	 	
	 	this.hasProduct = !!products.length;
	 	this.products = products;
	}


	loadProductFromCookie(products) {
		if (products) {
			return this.products = products;
		}
		
		// this.SessionStorageFactory.get('products').then((products) => this.products = products);		
		return this.CookieFactory.get('products') || [];
	}

	produceCartElements(products) {
		if (!products || !products.length) {
			return products;
		}

		let totalPrice = 0;
		const produceContext = (name, quantity) => `<div class="product-heading">${name}</div><div class="quantity"> x ${quantity}</div>`;

		products.forEach((product) => {
			// product.context = produceContext(product.name, product.quantity);
			totalPrice += product.totalPrice;
		});

		this.totalPrice = totalPrice;
		return products;
	}

	removeProduct($event, index) {
		$event.preventDefault();
		$event.stopPropagation();

		if (this.$state.current.name === 'shop.menu.checkout') {
			return this.EventListener.broadcast('removeProductListItem', index);	
		}

		// this.CookieFactory.remove('products', index);
		// this.CookieFactory.remove('products');
		
		let products = this.products;

		products.splice(index, 1);
		this.refreshUserCartProducts(products, true);
	}

}



export const userCartComponent = {
	template: userCartTemplate,
	controller: UserCartController,
	controllerAs: '$vm',
	bindings: {}
};
