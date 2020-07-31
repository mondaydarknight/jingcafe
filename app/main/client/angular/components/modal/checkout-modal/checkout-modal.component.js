import checkoutModalTemplate from './checkout-modal.template.html';

class CheckoutModalController {

	constructor($q, UserService, EventListener, CONSTANTS) {
		this.$q = $q;
		this.UserService = UserService;
		this.EventListener = EventListener;
	}

	$onInit() {
		this.checkoutParams = this.resolve.checkoutParams;
	}

	$postLink() {
		this.isSubmit = false;
	}

	checkout() {
		const deferred = this.$q.defer();
		this.isSubmit = true;
		this.EventListener.broadcast('isLoading', true);

		return this.UserService.checkout(this.checkoutParams)
			.then((response) => deferred.resolve(response), (error) => deferred.reject(error))
			.finally(() => {
				this.isSubmit = false;
				this.EventListener.broadcast('isLoading', false);
				this.modalInstance.close(deferred.promise);
			});
	}

	cancel() {
		return this.modalInstance.dismiss();
	}

	set checkoutParams(checkoutParams) {
		this._checkoutParams = checkoutParams;
	}

	get checkoutParams() {
		return this._checkoutParams;
	}

}


export const checkoutModalComponent = {
	template: checkoutModalTemplate,
	controller: CheckoutModalController,
	controllerAs: '$vm',
	bindings: {
		resolve: '<',
		modalInstance: '<'
	}
};




