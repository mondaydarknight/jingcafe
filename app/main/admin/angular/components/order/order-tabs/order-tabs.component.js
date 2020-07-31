import orderTabsTemplate from './order-tabs.template.html';


class OrderTabsController {

	constructor($scope) {
		'ngInject';

		this.$scope = $scope;
	}

	$onInit() {
		this.tabs = [];
		this.tabIndex = 0;
	}

	addOrderTab(tab) {
		this.tabs.push(tab || {});
	}

	selectTab(index) {
		for (let i=0; i<this.tabs.length; i++) {
			this.tabs[i].selected(false);
		}

		this.tabIndex = index;
		this.tabs[index].selected(true);
	}

	/**
	 * this.selectIndex passed down from bindings
	 * a safer option would be to parseInt(, 10)
	 * to coerce to a Number to lookup the Array index
	 */
	$postLink() {
		setTimeout(() => {
			this.selectTab(this.selectIndex || 0);
			this.$scope.$apply();
		});
	}

	$onDestroy() {
		
	}

}

export const orderTabsComponent = {
	transclude: true,
	template: orderTabsTemplate,
	controller: OrderTabsController,
	controllerAs: '$vm',
	bindings: {}
};


