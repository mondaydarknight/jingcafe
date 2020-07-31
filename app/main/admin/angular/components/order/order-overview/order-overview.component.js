import orderOverviewTemplate from './order-overview.template.html';

class OrderOverviewController {


	constructor($scope, $state, EventListener, ToolFactory, OrderService, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.EventListener = EventListener;
		this.ToolFactory = ToolFactory;
		this.OrderService = OrderService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.EventListener.broadcast('isLoaderActive', false);
		this.searchTypes = ['dateTime', 'user'];
	}

	$postLink() {
		
	}

	set composition(composition) {
		for (let i=0; i<composition.length; i++) {
			composition[i].time = this.ToolFactory.camelCase(composition[i].time);
		}

		this._composition = composition;
	}

	get composition() {
		return this._composition;
	}

	set orders(orders) {
		if (!orders || !orders.length) {
			return this._orders = [];
		}
		
		this._orders = orders;
	}

	get orders() {
		return this._orders;
	}

	/** 
	 * Broadcast the event listener (subscriber) from orderSearchEngine Controller
	 */
	refresh() {
		return this.$scope.$broadcast('searchOrders');
	}

	search(searchType, params) {
		this.EventListener.broadcast('isLoaderActive', true);
		this.$scope.$broadcast('clearSettingCollection');
		
		if (this.searchTypes.indexOf(searchType) == -1 || !this.OrderService[searchType]) {
			throw new Error(`Undefined searchType ${searchType} to request server.`);
		}

		this.OrderService[searchType](params).then((response) => {
			this.orders = response.data;
		}, (error) => {
			throw new Error(error);
		}).finally(() => this.EventListener.broadcast('isLoaderActive', false));

	}

	renderOrders() {

	}

}

export const orderOverviewComponent = {
	template: orderOverviewTemplate,
	controller: OrderOverviewController,
	controllerAs: '$vm',
	bindings: {
		composition: '<',
		orders: '<'
	}
};

