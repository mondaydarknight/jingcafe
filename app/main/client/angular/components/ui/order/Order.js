
export default class Order {

	constructor($scope, $state, $compile, $element, EventListener, UserService, ToolFactory, toastr, CONSTANTS) {
		this.$scope = $scope;
		this.$state = $state;
		this.$compile = $compile;
		this.$element = $element;
		this.EventListener = EventListener;
		this.UserService = UserService;
		this.ToolFactory = ToolFactory;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;

		this.init();
	}

	set isRender(isRender) {
		if (Object.prototype.toString.call(isRender) !== '[object Boolean]') {
			throw new TypeError('Undefined type in isRender variable');
		}

		this._isRender = isRender;
	}

	get isRender() {
		return this._isRender;
	}
	
	set orderCache(orderCache) {
		this._orderCache = orderCache;
	}

	get orderCache() {
		return this._orderCache;
	}

	set orders(orders) {
		if (!orders) {
			return this._orders = [];
		}
		
		this._orders = orders.map((order) => {
			order.statusName = this.CONSTANTS.ORDER.STATUS[order.status];
			return order;
		});

	}

	get orders() {
		return this._orders;
	}

	init() {
		this.$orderContainer = this.$element.find('.order-container');
		this.$scope.$on('renderOrderView', (event, orders) => this.orders = orders);
	}

	/** 
	 * Add order into userOrderOverview tabs
	 */
	loadTab() {
		const orderTab = {
			title: () => this.title,
			select: (isSelected) => {
				isSelected ? this.$element.show() : this.$element.hide();
				return orderTab;
			},
			getOrdersFromCache: (index) => {
				if (!this.orderCache[index]) {
					this.toastr.error(this.CONSTANTS.ERROR.UNKNOWN);
					this.$state.go('shop.home');
					throw new TypeError('Undefiend variable index in order.');
				}
				
				return this.orderCache[index];
			},
			render: () => {
				if (this.isRender) {
					return;
				}

				const orderMethod = `${this.type}Orders`;
		
				if (!orderMethod in this.UserService) {
					throw new Error('Undefined method in ${orderMethod} in Order http request');
				}

				this.UserService[orderMethod]().then((response) => {
					this.setOrders(response.data);
				}, (error) => {
					return this.$state.reload();
		 		});
			},
			filterByOrderId: () => {}
		};

		orderTab.select(false);
		this.userOrderTabs.userOrderOverview.addOrderTab(orderTab);

		this._autoRenderOrderView();
	}

	setOrders(orders) {
		this.isRender = true;
		this.orderCache = orders;
		this.orderQuantity = orders.length;
		this.$scope.$broadcast('divideItemsIntoPages', orders);
	}

	/**
	 * Set scope watch the orders changed and render
	 *
	 * @todo we only compile childNodes so that we don't get into infinite loop compile ourselves.
	 */
	_autoRenderOrderView() {
		this.$scope.$watch(() => this.orders, (orders) => {
			if (!orders || !orders.length) {
				return;
			}

			if (!'buildOrderItemsView' in this) {
				throw new Error('Undefined method buildOrderItemsView.');
			}

			this.buildOrderItemsView(orders);
		});

	}



	// initOrderHanler() {
	// 	const orderHandler = {
	// 		title: () => this.title,
	// 		select: (isSelected) => {
	// 			this.EventListener.broadcast('display', this.elementDisplay, isSelected);
	// 			return orderHandler;
	// 		},
	// 		getOrders: () => this.orders,
	// 		render: (orders) => this.render(orders),
	// 		filterOrderById: (orderId) => {
	// 			this.orders = this.orderCache;
				
	// 			if (typeof orderId === null || orderId === '') {
	// 				return this.render();
	// 			}

	// 			if (isNaN(orderId)) {
	// 				return this.render([]);
	// 			}

	// 			this.render(this.orders.filter((order) => {
	// 				return order.id === Number(orderId);
	// 			}));
	// 		}
	// 	};
		
	// 	orderHandler.select(true);
	// 	this.parent.addOrder(orderHandler);
	// }

	/**
	 * @property public 
	 * Using the singleton of design pattern 
	 * @todo If the orderCache have orders 
	 * @param array[mixed] 	The array
	 */
	// render(orders) {
	// 	if (angular.isArray(orders)) {
	// 		return this.orders = orders;
	// 	}

	// 	if (this.orderCache) {
	// 		return this.EventListener.broadcast('divideListViewPage', this.orderCache);
	// 		// return this.orders = this.orderCache;
	// 	}

	// 	const orderMethod = `get${this.type.charAt(0).toUpperCase()}${this.type.slice(1)}Orders`;
		
	// 	if (!orderMethod in this.UserService) {
	// 		throw new Error('Undefined method in ${orderMethod} in Order http request');
	// 	}

	// 	// let promise = new Promise((resolve, reject) => {
	// 	// 	this.UserService[orderMethod]().then((response) => {
	// 	// 		this.orders = this.orderCache = response.status === 200 && response.data;
	// 	// 		resolve(response.data);
	// 	// 	}, (error) => {
	// 	// 		this.toastr.error(this.CONSTANTS.ERROR.NOT_LOGIN);
	// 	// 		reject(error);
	// 	// 	});
	// 	// });

	// 	this.UserService[orderMethod]().then((response) => {
	// 		if (response.status === 200) {
	// 			this.orderCache = response.status === 200 && response.data;
	// 			this.EventListener.broadcast('divideListViewPage', this.orderCache);
	// 		}
	// 	}, (error) => {
	// 		return this.$state.reload();
 // 		});
	// }

}



