import userOrderOverviewTemplate from './user-order-overview.template.html';

class UserOrderOverviewController {

	constructor($scope, $state, $q, $timeout, ToolFactory, EventListener, toastr, CONSTANTS) {
		'ngInject';
		
		this.$scope = $scope;
		this.$state = $state;
		this.$timeout = $timeout;
		this.toastr = toastr;
		this.EventListener = EventListener;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.tabIndex = 0;
		this.orderTabs = [];
	}

	$postLink() {
		this.orderTabs.length && this.orderTabs[this.tabIndex].select(true);
	}
	
	addOrderTab(orderTab) {
		this.orderTabs.push(orderTab);
	}

	selectTab(index) {
		let tabIndex = this.tabIndex;
		this.orderTabs[tabIndex].select(false);
		this.orderTabs[index].select(true).render();
		this.tabIndex = index;	
	}

	getOrder(index) {
		if (!this.orderTabs.length) {
			return this.$state.go('shop.home');
		}

		return this.orderTabs[this.tabIndex].getOrdersFromCache(index);
	}

}

export const userOrderOverviewComponent = {
	require: {
		shopBase: '^^'
	},
	template: userOrderOverviewTemplate,
	controller: UserOrderOverviewController,
	controllerAs: '$vm',
	bindings: {}
};

