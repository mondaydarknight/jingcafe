import removeProductModalTemplate from './remove-product-modal.template.html';

class RemoveProductModalController {

	constructor(ProductService, EventListener, toastr, CONSTANTS) {
		'ngInject';

		this.ProductService = ProductService;
		this.EventListener = EventListener;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	confirm() {
		this.EventListener.broadcast('isLoaderActive', true);
		
		this.ProductService.remove(this.resolve).then((response) => {
			this.toastr.info(this.CONSTANTS.INFO.DELETE);
			return this.modalInstance.close();
		})
		.finally(() => this.EventListener.broadcast('isLoaderActive', false));
	}

	cancel() {
		return this.modalInstance.dismiss();
	}



}


export const removeProductModalComponent = {
	template: removeProductModalTemplate,
	controller: RemoveProductModalController,
	controllerAs: '$vm',
	bindings: {
		resolve: '<',
		modalInstance: '<'
	}
};
