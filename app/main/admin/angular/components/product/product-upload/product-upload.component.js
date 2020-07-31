import productUploadTemplate from './product-upload.template.html';

class ProductUplaodController {

	constructor($state, $uibModal, EventListener, FileUploader, ToolFactory, ErrorHandler, toastr, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.$uibModal = $uibModal;
		this.EventListener = EventListener;
		this.FileUploader = FileUploader;
		this.ToolFactory = ToolFactory;
		this.ErrorHandler = ErrorHandler;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

		
	$onInit() {
		this.EventListener.broadcast('isLoaderActive', false);
		this.categories = this.adminLayout.shop.categories;
	}	

	$postLink() {
		this.flagEnabled = [
			{
				name: '上架中',
				enabled: true
			},
			{
				name: '已下架',
				enabled: false
			}
		];
	}


	upload($event) {
		$event.stopPropagation();

		if (this.files && this.files.length) {
			angular.extend(this.product, {file: this.files[0]});
		}

		const productUploadModal = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'productUploadModal',
			size: 'lg',
			resolve: {
				product: () => this.product
			}
		});


		productUploadModal.result.then((response) => {
			this.toastr.success(this.CONSTANTS.SUCCESS.UPLOAD);
			return this.$state.go('admin.product.overview');
		}, (error) => {
			if (!error) {
				return;
			}

			error = this.ErrorHandler.parse(error.data.exception[0].message);

			if (error.hasFormGroupElementError()) {
				error.alertByFormGroupElement();
			}

			if (error.hasToastError()) {
				error.alertByToast();
			}

		});
	}

	set product(product) {
		this._product = this.ToolFactory.convertToCamelCase(product);
	}

	get product() {
		return this._product;
	}

}


export const productUploadComponent = {
	require:{
		adminLayout: '^'
	},
	template: productUploadTemplate,
	controller: ProductUplaodController,
	controllerAs: '$vm',
	bindings: {
		product: '<'
	}
};
