import userOrderDetailTemplate from './/user-order-detail.template.html';

class UserOrderDetailController {

	constructor($scope, $state, $compile, $window, $timeout, EventListener, ToolFactory, toastr, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.$compile = $compile;
		this.$window = $window;
		this.$timeout =  $timeout;
		this.EventListener = EventListener;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		const $timelineElement = angular.element(document.getElementById('order-timeline'));
		let order = this.userOrderTabs.userOrderOverview.getOrder(this.cacheIndex);

		this.userOrderTabs.orderView.style.display = 'none';

		if (order.status === 'C') {
			$timelineElement[0].innerHTML = `<user-order-timeline></user-order-timeline>`;
			this.$compile($timelineElement.contents())(this.$scope);
		}

		order = this.convertOrderTimestamp(order);
		order.userPayment.account = order.userPayment.account || '';		

		this.order = order;
	}

	$onDestroy() {
		this.userOrderTabs.orderView.style.display = 'block';
	}

	directToLastPage() {
		return this.$state.go('shop.user.order.list');
	}

	convertOrderTimestamp(order) {
		const timestampColumns = ['createdAt', 'expiredAt', 'producedAt', 'cancelAt'];

		for (let i=0; i<timestampColumns.length; i++) {
			if (timestampColumns[i] in order && Object.prototype.toString.call(order[timestampColumns[i]]) === '[object String]') {
				order[timestampColumns[i]] = order[timestampColumns[i]].slice(0, 16);
			}
		}

		return order;
	}

	set order(order) {
		this._order = order;
	}

	get order() {
		return this._order;
	}

}

export const userOrderDetailComponent = {
	require: {
		userOrderTabs: '^'
	},
	template: userOrderDetailTemplate,
	controller: UserOrderDetailController,
	controllerAs: '$vm',
	bindings: {
		cacheIndex: '<'
	}
};



