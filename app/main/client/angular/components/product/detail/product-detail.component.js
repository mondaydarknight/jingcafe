import productDetailTemplate from './product-detail.template.html';


class ProductDetailController {

	constructor($rootScope, $document, $sce, $state, toastr, $timeout, AuthService, CookieFactory, EventListener, ToolFactory, ShopService, ProductService, CONSTANTS) {
		'ngInject';

		this.$rootScope = $rootScope;
		this.$document = $document;
		this.$sce = $sce;
		this.$state = $state;
		this.toastr = toastr;
		this.$timeout = $timeout;
		this.AuthService = AuthService;
		this.CookieFactory = CookieFactory;
		this.EventListener = EventListener;
		this.ToolFactory = ToolFactory;
		this.timeController = ToolFactory.TimeController();
		this.ShopService = ShopService;
		this.ProductService = ProductService;
		this.CONSTANTS = CONSTANTS;
	}

	set product(product) {
		if (!product) {
			throw new Error(`Undefined variables products ${product}`);
		}

		this._product = product;
	}

	get product() {
		return this._product;
	}

	$onInit() {
		this.product.quantity = 1;
		this.product.description = this.$sce.trustAsHtml(this.product.description);

		angular.element(this.$document[0].body.querySelectorAll('.fancybox')).fancybox({
			padding: 0,
			autoResize: true,
			showCloseButton: true,
			titlePosition: 'inside',
			titleFormat: 'formatTitle',
			autoDimensions: false,
			height: 'auto',
			transitionIn: 'none',
			transitionOut: 'none',
			afterShow: () => {
				this.$document[0].body.querySelector('.fancybox-close').innerHTML = '<i class="fancybox-close-icon fa fa-times"></i>';
			},
			helpers: { 
 			   	overlay: { 
        			locked: false 
    			} 
			}
		});
	}

	redirectToProductOverview() {
		return this.ProductService.directToDefaultProductList();
	}

	plus($event) {
		$event.preventDefault();
		const plusProductQuantity = () => parseInt(this.product.quantity, 10) < this.product.amount && this.product.quantity++;
		plusProductQuantity();
		// this.timeController.throttle(plusProductQuantity, 50);
	}

	substract($event) {
		$event.preventDefault();
		const substractProductQuantity = () => parseInt(this.product.quantity, 10) > 1 && this.product.quantity--;
		substractProductQuantity();
		// this.timeController.throttle(substractProductQuantity, 50);
	}

	/**
	 * Get the products of COOKIE from browser
	 * @access public
	 */
	loadProductFromCookie() {
		return this.CookieFactory.get('products');
	}

	inputQuantity() {
		if (this.product.quantity > this.product.amount) {
			this.product.quantity = this.product.amount;
		} else if (this.product.quantity < 1 || !this.product.quantity) {
			this.product.quantity = 1;
		}
	}

	purchase(isDirectHref = false) {
		let quantity = parseInt(this.product.quantity, 10);

		if (Object.prototype.toString.call(quantity) !== '[object Number]' || quantity < 1 || quantity > this.product.amount) {
			return this.toastr.error(this.CONSTANTS.ERROR.PURCHASE_ERROR);
		}

		// Determine wether the user is exist.
		if (!this.AuthService.isAuthenticated) {
			this.toastr.error(this.CONSTANTS.ERROR.NOT_LOGIN);
			return this.$state.go('shop.home', {isOpenLoginModal: true});
		}

		let products = mergeProducts.call(this, this.loadProductFromCookie());
		this.EventListener.broadcast('refreshUserCartProducts', products, true);
		return isDirectHref && this.$state.go('shop.menu.checkout');
	}

}

function mergeProducts(cookieProducts) {
	const getTotalPrice = (price, quantity) => price * quantity;
	
	let columns = ['id', 'name', 'amount', 'profile', 'quantity'];
	let isProductIdentical = false;
	let tempProducts = cookieProducts;

	for (let key in tempProducts) {
		if (tempProducts[key].id === this.product.id) {				
			let quantity = parseInt(tempProducts[key].quantity, 10) + parseInt(this.product.quantity, 10);
			
			isProductIdentical = true;

			if (quantity > this.product.amount) {
				this.toastr.error(this.CONSTANTS.ERROR.PRODUCT_QUANTITY);
				break;
			}

			tempProducts[key].quantity = quantity;
			tempProducts[key].totalPrice = getTotalPrice(tempProducts[key].price, quantity);
			this.toastr.success(this.CONSTANTS.SUCCESS.ADD_PRODUCT);
			break;
		}
	}

	if (!isProductIdentical) {
		let product = {};

		for (let key in this.product) {			
			if (columns.indexOf(key) > -1) {
				product[key] = this.product[key];
			}
		}
				
		product.price = this.product.currentPrice || this.product.price;
		product.totalPrice = getTotalPrice(product.price, this.product.quantity);
		tempProducts.push(product);
		this.toastr.success(this.CONSTANTS.SUCCESS.ADD_PRODUCT);
	}

	return tempProducts;	
}



export const productDetailComponent = {
	require: {
		shopBase: '^',
		productInterface: '^^'
	},
	template: productDetailTemplate,
	controller: ProductDetailController,
	controllerAs: '$vm',
	bindings: {
		product: '<',
		recommendProducts: '<'
	}
};


