class OrderCancelController {

	constructor() {

	}

	$onInit() {

	}

	set orders(orders) {
		if (!orders || !orders.length) {
			return this._orders = [];
		}

		this._orders = orders.filter((order) =>  order.status.toUpperCase() === 'D');
	} 

	get orders() {
		return this._orders;
	}

}

export const orderCancelComponent = {
	// templateUrl: '/templates/user/order-cancel.html',
	controller: OrderCancelController,
	controllerAs: '$vm',
	bindings: {
		orders: '<'
	}
};