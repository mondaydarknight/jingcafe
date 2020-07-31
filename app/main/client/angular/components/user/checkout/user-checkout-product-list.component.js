import userCheckoutProductListTemplate from './user-checkout-product-list.template.html';


class UserCheckoutProductListController {

	constructor($scope, $document, $filter, $timeout, DOMFactory, EventListener, ProductService, toastr, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$document = $document;
		this.$filter = $filter;
		this.$timeout = $timeout;
		this.DOMFactory = DOMFactory;
		this.EventListener = EventListener;
		this.ProductService = ProductService;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.totalPriceElement = this.$document[0].body.querySelector('.price');
		this.$productListContent = angular.element(this.$document[0].body.querySelector('.product-list-content'));
		this.EventListener.on('removeProductListItem', this.removeProductListItem, this);

		renderProductListView.call(this);
		this.queryDocumentElements().createProductListEvents();
		this._calculateProductTotalPrice();
	}

	$onDestroy() {
		this.EventListener.off('removeProductListItem', this.removeProductListItem);
	}

	queryDocumentElements() {
		this.inputQuantityGroup =  Array.prototype.slice.call(this.$productListContent[0].querySelectorAll('.input-quantity'), 0)
		this.buttonMinusGroup = Array.prototype.slice.call(this.$productListContent[0].querySelectorAll('[data-action="minus"]'), 0);
		this.buttonPlusGroup = Array.prototype.slice.call(this.$productListContent[0].querySelectorAll('[data-action="plus"]'), 0);
		this.buttonCancelGroup = Array.prototype.slice.call(this.$productListContent[0].querySelectorAll('.btn-cancel'), 0);
		this.totalPriceGroup = Array.prototype.slice.call(this.$productListContent[0].querySelectorAll('.total-price'), 0);
		return this;				
	}

	createProductListEvents() {

		const removeProductListItemFirst = (event) => {			
			const target = event.target || event.srcElement;

			// return this.removeProductListItem(this.buttonCancelGroup.indexOf(this.DOMFactory.closest(target, '.btn-cancel')));			
			return this.removeProductListItem(this.buttonCancelGroup.indexOf(event.target.closest('.btn-cancel')));
		};

		this.inputQuantityGroup.forEach((element) => element.onkeyup = this._inputProductQuantity.bind(this));
		this.buttonMinusGroup.forEach((element) => element.onclick = this._subtractProductQuantity.bind(this));
		this.buttonPlusGroup.forEach((element) => element.onclick = this._addProductQuantity.bind(this));
		this.buttonCancelGroup.forEach((element) => element.onclick = removeProductListItemFirst);
	}

	_calculateProductTotalPrice() {
		const _calculate = (products) => {
			let totalPrice = 0; 

			products.forEach((product) => totalPrice += product.totalPrice);
			return totalPrice;
		};

		this.userCheckout.params.productTotalPrice = _calculate(this.userCheckout.products);
		this.totalPriceElement.textContent = this.$filter('currency')(this.userCheckout.params.productTotalPrice, '$NT', 0);
	}

	_inputProductQuantity(event) {
		const currentIndex = this.inputQuantityGroup.indexOf(event.target);

		if (currentIndex === -1) {
			return;
		}

		if (event.target.value > this.userCheckout.products[currentIndex].amount) {
			this.userCheckout.products[currentIndex].quantity = event.target.value = this.userCheckout.products[currentIndex].amount;
		} else if (event.target.value < 1) {
			this.userCheckout.products[currentIndex].quantity = event.target.value = 1;
		} else {
			this.userCheckout.products[currentIndex].quantity = event.target.value;
		}

		this._renderCurrentItemPrice(currentIndex);
		!this.$scope.$$phase && this.$scope.$apply();
	}

	_subtractProductQuantity(event) {
		const buttonMinusTarget =  event.target.closest('.btn-quantity');
		const currentIndex = this.buttonMinusGroup.indexOf(buttonMinusTarget);

		if (currentIndex === -1) {
			return;
		}

		let quantity = parseInt(this.userCheckout.products[currentIndex].quantity, 10);

		if (quantity -1 < 1) {
			return;
		}

		this.inputQuantityGroup[currentIndex].value = this.userCheckout.products[currentIndex].quantity = quantity - 1;
		return this._renderCurrentItemPrice(currentIndex);
	}	

	_addProductQuantity(event) {
		const buttonPlusTarget = event.target.closest('.btn-quantity');
		const currentIndex = this.buttonPlusGroup.indexOf(buttonPlusTarget);

		if (currentIndex === -1) {
			return;
		}

		let quantity = parseInt(this.userCheckout.products[currentIndex].quantity, 10);

		if (quantity + 1 > this.userCheckout.products[currentIndex].amount) {
			return;
		}

		this.inputQuantityGroup[currentIndex].value = this.userCheckout.products[currentIndex].quantity = quantity + 1;
		return this._renderCurrentItemPrice(currentIndex);
	}

	removeProductListItem(index) {
		if (index === -1) {
			return;
		} else if (this.userCheckout.products.length - 1 === 0) {
			return this.toastr.error(this.CONSTANTS.ERROR.NEED_PRODUCT_QUANTITY);
		}
		
		this.userCheckout.products.splice(index, 1);	
		this.EventListener.broadcast('refreshUserCartProducts', this.userCheckout.products, true);
		angular.element(this.$productListContent[0].querySelectorAll('.product-content-item-wrap')[index]).slideUp();
		this._calculateProductTotalPrice();

		return this.$timeout(() => {
			renderProductListView.call(this);
			this.queryDocumentElements().createProductListEvents();			
		}, 500);
	}

	_renderCurrentItemPrice(index) {
		let productTotalPrice = this.userCheckout.products[index].quantity * this.userCheckout.products[index].price;

		this.userCheckout.products[index].totalPrice = productTotalPrice;
		this.totalPriceGroup[index].textContent = this.$filter('currency')(productTotalPrice, '$', 0);
		this.EventListener.broadcast('refreshUserCartProducts', this.userCheckout.products, false);
		this._calculateProductTotalPrice();
	}

	directToProudctPage() {
		return this.ProductService.directToDefaultProductList();
	}

}

function renderProductListView() {
	let listView = '';
	let products = this.userCheckout.products;

	for (let i=0; i<products.length; i++) {
		listView += 
			`<div class="row product-content-item-wrap mobile-no-padding">					
				<div class="main-item">
					<div class="product-content-item">
						<div class="product-pic" style="background-image: url(${products[i].profile});"></div>
						<span class="product-name">${products[i].name}</span>
					</div>	
				</div>
				<div class="sub-item">
					<div class="product-content-item">
						<span class="product-price">${this.$filter('currency')(products[i].price, '$', 0)}</span>
					</div>
					<div class="product-content-item">
						<div class="input-group product-select-quantity">
							<span class="input-group-btn">
								<button class="btn btn-default btn-quantity no-transform btn-none" data-action="minus">
									<i class="fa fa-minus"></i>
								</button>
							</span>
							<input type="text" name="quantity" class="form-control text-center input-quantity" value="${products[i].quantity}" onkeypress="return event.charCode >= 48 && event.charCode <= 57;">
							<span class="input-group-btn">
								<button class="btn btn-default btn-quantity no-transform btn-none" data-action="plus">
									<i class="fa fa-plus"></i>
								</button>
							</span>
						</div>							
					</div>
					<div class="product-content-item">
						<span class="product-price total-price">${this.$filter('currency')(products[i].totalPrice, '$', 0)}</span>
					</div>
					<div class="product-content-item">
						<div class="content-item-inner">
							<button type="button" class="btn btn-cancel" data-label="Close">
								<em aria-hidden="true" class="sn-link-close">&times;</em>
							</button>
						</div>	
					</div>
				</div>
			</div>`;
	}

	this.$productListContent[0].innerHTML = listView;
	// !this.$scope.$$phase && this.$scope.$digest();
}


export const userCheckoutProductListComponent = {
	require: {
		userCheckout: '^'
	},
	template: userCheckoutProductListTemplate,
	controller: UserCheckoutProductListController,
	controllerAs: '$vm',
	bindings: {}
};