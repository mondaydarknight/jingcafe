import purchaseProgressTemplate from './purchase-progress.template.html';


class PurchaseProgressController {

	constructor() {
		'ngInject';

	}


}


export const purchaseProgressComponent = {
	template: purchaseProgressTemplate,
	controller: PurchaseProgressController,
	controllerAs: '$vm',
	bindings: {}
};
