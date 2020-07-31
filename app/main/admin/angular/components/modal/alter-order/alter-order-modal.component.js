import alterOrderModalTemplate from './alter-order-modal.template.html';


class AlterOrderModalController {

	constructor(ToolFactory, OrderService, toastr, CONSTANTS) {
		'ngInject';

		this.ToolFactory = ToolFactory;
		this.OrderService = OrderService;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.type = this.resolve.type;
		this.action = this.resolve.action;
		this.orderIndexes = this.resolve.orderIndexes;
	}

	cancel() {
		this.modalInstance.dismiss();
	}

	confirm() {
		const alterParams = {type: this.type, orderIndexes: this.orderIndexes};

		this.OrderService.alter(alterParams).then(() => {
			this.modalInstance.close();
			this.toastr.info(this.CONSTANTS.INFO.UPDATE);
		}, (error) => {
			this.toastr.error(this.CONSTANTS.ERROR.UNKNOWN);
			throw new Error(error.data.exception[0].message);
		});
	}

}

export const alterOrderModalComponent = {
	template: alterOrderModalTemplate,
	controller: AlterOrderModalController,
	controllerAs: '$vm',
	bindings: {
		resolve: '<',
		modalInstance: '<'
	}
};




