import userCheckoutPaymentTemplate from './user-checkout-payment.template.html';

class UserCheckoutPaymentController {

	constructor($scope, $document, $timeout, $sce, $templateCache) {
		'ngInject';

		this.$scope = $scope;
		this.$document = $document;
		this.$timeout = $timeout;
		this.$sce = $sce;
		this.$templateCache = $templateCache;
	}

	$onInit() {
		this.iconChecked = this.$sce.trustAsHtml(this.$templateCache.get('icon-checked'));
		this.payments = this.userCheckout.payments;
		this.$timeout(() => this.userCheckout.userPayment && this._setUserPayment());
	}

	_setUserPayment() {
		let paymentIndex;

		for (let i=0; i<this.userCheckout.payments.length; i++) {
			if (this.userCheckout.payments[i].id === this.userCheckout.userPayment.paymentId) {
				paymentIndex = i;
				break;
			}
		}

		if (typeof paymentIndex === 'undefined') {
			throw new Error('Unknown payment.');
		}

		this.selectPayment(paymentIndex);
	}

	selectPayment(index) {
		if (!this.payments[index]) {
			return;
		}

		const paymentGroup = Array.prototype.slice.call(this.$document[0].body.querySelectorAll('.payment-group'));

		paymentGroup.forEach((payment) => payment.classList.remove('active'));
		paymentGroup[index].classList.add('active');

		this.selected = true;
		this.userCheckout.params.payment = this.payments[index];

	}

}


export const userCheckoutPaymentComponent = {
	require: {
		userCheckout: '^'
	},
	template: userCheckoutPaymentTemplate,
	controller: UserCheckoutPaymentController,
	controllerAs: '$vm',
	bindings: {}
};

