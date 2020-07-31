import orderTemplate from './order.template.html';

class OrderController {

	constructor($scope, $document, $compile, $uibModal, EventListener, DocumentFactory, ToolFactory, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.$document = $document;
		this.$compile = $compile;
		this.$uibModal = $uibModal;
		this.EventListener = EventListener;
		this.DocumentFactory = DocumentFactory;
		this.ToolFactory = ToolFactory;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		const orderTab = {
			title: () => this.title,
			selected: (isSelected) => {
				this.selected = isSelected;
			}
		};
		
		this.settingCollection = new Array();
		this.selected = false;
		this.orderTabs.addOrderTab(orderTab);
		this.$scope.$on('clearSettingCollection', (event) => this.settingCollection = new Array());

	}

	$postLink() {
		this.$listView = this.$document[0].body.querySelectorAll('.list-view');
		this._preloadToggleListView();
		this._buildOperateSetting();
	}

	$onChanges(changes) {
		this.hasResult = !!this.orders.length;
	}
	
	set orders(orders) {
		if (!orders || !orders.length) {
			return this._orders = [];
		}

		let tempOrders = [];
		const timestampColumns = ['createdAt', 'expiredAt', 'paidAt', 'producedAt', 'canceledAt'];

		orders.forEach((order) => {
			if (order.status === this.status) {
				order.isDetailActive = false;

				for (let i=0; i<timestampColumns.length; i++) {
					if (timestampColumns[i] in order && Object.prototype.toString.call(order[timestampColumns[i]]) === '[object String]') {
						order[timestampColumns[i]] = order[timestampColumns[i]].slice(0, 16);
					}
				}

				order.time = order[this.time];
				tempOrders.push(order);
			}
		});
		
		this._orders = tempOrders;
	}

	get orders() {
		return this._orders;
	}

	/**
	 * Angular ng-repeat render individual order elements
	 * Every order element preload click event. 
	 */
	_preloadToggleListView() {
		const $currentListView = this.$listView[this.$listView.length - 1];

		angular.element($currentListView)
		/**
		 * Toggle detail list view
		 */
		.on('click', 'b.fa-angle-down', (event) => {
			const currentIndex = this.DocumentFactory.getElementsIndex($currentListView.querySelectorAll('b.fa-angle-down'), event.target);
			const $detailListView = angular.element($currentListView.querySelectorAll('.detail-list-view')[currentIndex]);
			
			this.orders[currentIndex].isDetailActive = !this.orders[currentIndex].isDetailActive;
			this.orders[currentIndex].isDetailActive ? $detailListView.slideDown() : $detailListView.slideUp();
		})
		
		/**
		 * Click checkbox of order item
		 */
		.on('click', 'input[name="operate-setting"]', (event) => {
			const currentElement = event.target;
			const currentIndex = this.DocumentFactory.getElementsIndex($currentListView.querySelectorAll('input[name="operate-setting"]'), currentElement);

			if (currentElement.checked) {
				this.settingCollection.push(currentIndex);
			} else {
				let checkboxIndex = this.settingCollection.indexOf(currentIndex);

				if (checkboxIndex > -1) {
					this.settingCollection.splice(checkboxIndex, 1);
				}
			}

			this.$scope.$apply();
		});
	}

	_buildOperateSetting() {
		if (this.CONSTANTS.ORDER.SETTING && this.CONSTANTS.ORDER.SETTING[this.type]) {
			const $settingItem = this.$document[0].body.querySelectorAll('div.content-setting')[this.$listView.length - 1];

			$settingItem.innerHTML = this.CONSTANTS.ORDER.SETTING[this.type];
			this.$compile($settingItem)(this.$scope);
		}
	}

	_matchOrderWithSettingCollection() {
		let tempIndexes = new Array();

		for (let i=0; i<this.settingCollection.length; i++) {
			this.orders[this.settingCollection[i]] && tempIndexes.push(this.orders[this.settingCollection[i]].id);
		}

		return tempIndexes;
	}


	selectAllItems($event) {
		const $operateCheckboxes = this.$listView[this.orderTabs.tabIndex].querySelectorAll('input[name="operate-setting"]');
		
		this.settingCollection = new Array();

		for (let i=0; i<$operateCheckboxes.length; i++) {
			$operateCheckboxes[i].checked = $event.target.checked;
			$event.target.checked && this.settingCollection.push(i);
		}
	}

	alterOrder(orderType) {
		const orderIndexes = this._matchOrderWithSettingCollection();
		const factor = this.orderOverview.composition.filter((order) => order.type === orderType)[0];

		const alterOrderModal = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'alterOrderModal',
			size: 'sm',
			resolve: {
				type: () => orderType,
				action: () => factor.name,
				orderIndexes: () => orderIndexes
			}
		});
	
		alterOrderModal.result.then(() => this.orderOverview.refresh());
	}

}

export const orderComponent = {
	require: {
		orderTabs: '^^',
		orderOverview: '^'
	},
	template: orderTemplate,
	controller: OrderController,
	controllerAs: '$vm',
	bindings: {
		title: '<',
		status: '<',
		type: '<',
		time: '<',
		orders: '<'
	}
};