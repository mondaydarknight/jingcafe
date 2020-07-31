import productOverviewTemplate from './product-overview.template.html';


class ProductOverviewController {

	constructor($scope, $state, $window, EventListener, ToolFactory, $uibModal) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.$window = $window;
		this.EventListener = EventListener;
		this.ToolFactory = ToolFactory;
		this.$uibModal = $uibModal;
	}

	$onInit() {
		this.EventListener.broadcast('isLoaderActive', false);
	}

	set products(products) {
		if (!products) {
			this.$window.location.reload();
			throw new Error('Undefiend variables products.');
		}
		
		products.forEach((product) => {
			product = this.ToolFactory.convertToCamelCase(product);
			product.enabled = product.flagEnabled ? '已上架' : '未上架';
		});

		this._products = products;
	}

	get products() {
		return this._products;
	}

	directToUploadPage($event, product) {
		$event.preventDefault();
		return product && this.$state.go('admin.product.upload', {product: JSON.stringify(product)});
	}
	

	removeProduct(index) {
		if (Object.prototype.toString.call(index) !== '[object Number]' || !this.products[index]) {
			return;
		}

		const removeProductModal = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'removeProductModal',
			size: 'sm',
			resolve: {
				productId: () => this.products[index].id
			}
		});

		removeProductModal.result.then((response) => {
			this.products.splice(index, 1);
		});
	}

}


export const productOverviewComponent = {
	template: productOverviewTemplate,
	controller: ProductOverviewController,
	controllerAs: '$vm',
	bindings: {
		products: '<'
	}
};



