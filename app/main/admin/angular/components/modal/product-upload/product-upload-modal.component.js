import productUploadModalTemplate from './product-upload-modal.template.html';

class ProductUploadModalController {

	constructor(AuthService, ProductService, EventListener) {
		'ngInject';

		this.AuthService = AuthService;
		this.ProductService = ProductService;
		this.EventListener = EventListener;
	}

	$onInit() {
		this.product = this.resolve.product;
	}

	cancel() {
		this.modalInstance.dismiss();
	}

	confirm($event) {
		$event.preventDefault();		
		this.EventListener.broadcast('isLoaderActive', true);

		const formData = new FormData();
		const uploadProduct = this.product;

		for (let key in uploadProduct) {
			if (key.indexOf('file') > -1) {
				formData.append('files', uploadProduct[key].file);
			} else if (key.indexOf('category') > -1) {
				formData.append('categoryId', uploadProduct[key].id)
			} else {
				formData.append(key, uploadProduct[key]);
			}
		}

		for (let key in this.AuthService.csrf) {
			formData.append(key, this.AuthService.csrf[key]);
		}

		this.modalInstance.close(this.ProductService.upload(formData).finally(() => this.EventListener.broadcast('isLoaderActive', false)));
	}	


	
}


export const productUploadModalComponent = {
	template: productUploadModalTemplate,
	controller: ProductUploadModalController,
	controllerAs: '$vm',
	bindings: {
		resolve: '<',
		modalInstance: '<'
	}
}



