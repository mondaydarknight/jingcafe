import userOrderTabsTemplate from './user-order-tabs.template.html';

class UserOrderTabsController {

	constructor(EventListener) {
		'ngInject';

		this.EventListener = EventListener;
	}

	$onInit() {
		this.orderView = document.getElementById('order-view');
	}

	set unpaidOrders(unpaidOrders) {
		if (!unpaidOrders || !unpaidOrders.length) {
			unpaidOrders = [];
		}
		
		this._unpaidOrders = unpaidOrders;
	}

	get unpaidOrders() {
		return this._unpaidOrders;
	}

}	

export const userOrderTabsComponent = {
	require: {
		userOrderOverview: '^^'
	},
	template: userOrderTabsTemplate,
	controller: UserOrderTabsController,
	controllerAs: '$vm',
	bindings: {
		unpaidOrders: '<'
	}
};


