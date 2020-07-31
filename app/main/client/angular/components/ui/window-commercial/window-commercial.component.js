import windowCommercialTemplate from './window-commercial.template.html';

class WindowCommercialController {

	constructor($state, $document, $timeout) {
		'ngInject';

		this.$state = $state;
		this.$document = $document;
		this.$timeout = $timeout;
	}

	$onInit() {
		const windowCommercial = this.$document[0].body.querySelector('.window-commercial');

		this.$timeout(() => windowCommercial.classList.add('active'), 1500);
	}

	directTopLatestProductPage() {
		return this.$state.go('shop.product.detail', {productId: this.product.id, productKey: this.product.product_key});
	}
}

export const windowCommercialComponent = {
	template: windowCommercialTemplate,
	controller: WindowCommercialController,
	controllerAs: '$vm',
	bindings: {
		product: '<'
	}
};


