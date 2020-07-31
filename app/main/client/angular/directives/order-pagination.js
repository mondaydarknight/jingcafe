

class OrderPaginationController {

	constructor($scope, CONSTANTS, EventListener, NumberService) {
		this.$scope = $scope;
		this.CONSTANTS = CONSTANTS;
		this.EventListener = EventListener;
		this.NumberService = NumberService;
	}

	$onInit() {
		this.$scope.$on('divideItemsIntoPages', (event, items) => this.divideItemsIntoPages(items));
		// this.EventListener.on('divideListViewPage', this.divideListViewPage, this);
		// this.$scope.$on('destroy', () => this.EventListener.off('divideListViewPage'));
	}

	$postLink() {
		this.paginationIndex = 0;
	}

	divideItemsIntoPages(items) {
		let tempItems = [];

		if (!items || !items.length) {
			return;
		}

		for (let i=0; i<items.length; i++) {
			if (i % this.itemsLimit === 0) {
				tempItems[Math.floor(i / this.itemsLimit)] = [items[i]];
			} else {
				tempItems[Math.floor(i / this.itemsLimit)].push(items[i]);
			}
		}

		this.listItems = tempItems;
		return this.switchPageByIndex(this.pageIndex);
	}

	switchPageByIndex(index) {
		if (this.pageIndex !== index && !this.listItems[index]) {			
			return;
		}

		return this.$scope.$emit('renderOrderView', this.listItems[this.pageIndex = index]);
	}

	set itemsLimit(itemsLimit) {
		if (!this.NumberService.isPositiveNumber(itemsLimit)) {
			throw new Error(`Variable items-list must be positive inteter. : ${this.CONSTANTS.VALIDATE.INVALID_INTEGER}`);
		}

		this._itemsLimit = parseInt(itemsLimit, 10);
	}

	get itemsLimit() {
		return this._itemsLimit;
	}

}

function orderPagination() {
	return {
		restrict: 'A',
		scope: {},
		template: `<ul class="pager-pagination">\
			<li class="pager-pagination-item" ng-repeat="item in $vm.listItems" ng-class="{'active': $index === $vm.pageIndex}"\
			 ng-click="$vm.switchPageByIndex($index)">\
			<a href class="pagination-link">{{$index+1}}</a></li></ul>`,
		controller: OrderPaginationController,
		controllerAs: '$vm',
		link: (scope, element, attr, controller) => {
			controller.itemsLimit = attr.itemsLimit || 5;
			controller.pageIndex = parseInt(attr.pageIndex, 10) || 0;
		}
	};
}

export const orderPaginationDirective = orderPagination;





