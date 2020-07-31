import Order from '../order/Order';
import orderUnpaidTemplate from './order-unpaid.template.html';

class OrderUnpaidController extends Order
{
	constructor($scope, $state, $compile, $element, $filter, $templateCache, $uibModal, EventListener, UserService, ToolFactory, toastr, CONSTANTS) {
		'ngInject';

		super($scope, $state, $compile, $element, EventListener, UserService, ToolFactory, toastr, CONSTANTS);
		this.$filter = $filter;
		this.$templateCache = $templateCache;
		this.$uibModal = $uibModal;
	}

	$onInit() {
		this.loadTab();
	}

	/**
	 * @todo The event broadcast must waiting directive compile complete
	 */
	$postLink() {
		this.setOrders(this.userOrderTabs.unpaidOrders);
	}

	/**
	 * Cancel the order 
	 *
	 * @access public
	 */
	cancelOrder($event, orderId) {
		$event.preventDefault();

		const modalInstance = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'cancelReasonModal',
			resolve: {
				orderId: () => orderId,
				reasons: () => this.UserService.getCancelReasons()
			}
		});

		modalInstance.result.then((response) => {
			if (response.status === 200) {
				this.toastr.info(this.CONSTANTS.INFO.CANCEL_ORDER);				
			}
			return this.$state.reload();
		}, (error) => {
			if (!error.data) {
				return;
			}

			this.ToolFactory.consoleError(error.data.exception ? error.data.exception[0].message : this.CONSTANTS.ERROR.UNKNOWN);			
			this.toastr.error(this.CONSTANTS.ERROR.UNKNOWN);
		});
	}
	

	buildOrderItemsView(orders) {
		let orderTemplate = '';
		
		for (let i=0; i<orders.length; i++) {
			let productTemplate = orders[i].products.length ? this.buildProductItemsView(orders[i], orders[i].products) : '';
			let productTotalPrice = orders[i].totalPrice - orders[i].logisticFee;

			let note = orders[i].paid
				 ? '<i class="icon icon-success"></i><span class="text-content">已付款完成 待確認中</span>' 
				 : '<i class="icon icon-warning"></i><span class="text-content">尚未付款 付款完請至mail回覆</span>';

			orderTemplate +=
				`<div class="order"> 
					<div class="order-wrap">
						<div class="order-header">
							<div class="order-header-top">
								<span class="flex1">訂單編號: ${orders[i].id}</span>
								<span class="flex0">訂單日期: ${orders[i].createdAt && orders[i].createdAt.slice(0, 10)}</span>	
							</div>
							<div class="row order-header-bottom">
								<div class="col-sm-4 col-4 order-column">
									<label class="item-link">商品</label>
								</div>
								<div class="col-sm-2 col-2 order-column">
									<label class="item-link">單價</label>
								</div>
								<div class="col-sm-2 col-2 order-column">
									<label class="item-link">總金額</label>
								</div>
								<div class="col-sm-2 col-2 order-column">
									<label class="item-link">目前狀態</label>
								</div>
								<div class="col-sm-2 col-2 order-column">
									<label class="item-link">物流方式</label>
								</div>	
							</div>
						</div>
						<div class="order-content">
							<div class="order-content-wrap">${productTemplate}</div>
						</div>
						<div class="order-bottom">
							<div class="order-column flex1">
								<div class="note note-guarantee">${note}</div>
								<div class="tag-wrap">
									<button class="btn btn-sm btn-info" ui-sref="shop.user.order.list.detail({'cacheIndex': ${i}})">查看明細</button>
									<button class="btn btn-sm btn-danger" ng-click="$vm.cancelOrder($event, ${orders[i].id})">取消訂單</button>
								</div>
							</div>
							<div class="order-column flex1">
								<div class="order-column column-wrap">
									<div class="order-item">
										<div class="item-text">商品小計 (含稅)</div>
										<div class="item-text">${productTotalPrice}</div>									
									</div>
									<div class="order-item">
										<div class="item-text">運費 </div>
										<div class="item-text">${orders[i].logisticFee}</div>									
									</div>
									<div class="order-item">
										<div class="item-text">商品總金額:</div>
										<div class="total-price">${orders[i].totalPrice}</div>								
									</div>								
								</div>								
							</div>
						</div>
					</div>
				</div>`;
			}

		this.$orderContainer[0].innerHTML = orderTemplate;
		this.$compile(this.$orderContainer.contents())(this.$scope);
	}

	
	buildProductItemsView(order, products) {
		let productTemplate = '';

		for (let key=0; key<products.length; key++) {
			productTemplate += `<div class="row order-content-item">
				<div class="col-sm-4 col-4 item-fragment item-overview"
					ui-sref="shop.product.detail({'productId': ${products[key].id}})">
					<div class="product-thumbnail" style="background-image: url(${products[key].profile});"></div>
						<span href class="product-name">${products[key].name}</span>
						<span class="product-quantity">x ${products[key].quantity}</span>							
					</div>
					<div class="col-sm-2 col-2 item-fragment">
						<span class="product-price">${this.$filter('currency')(products[key].price, '$', 0)}</span>
					</div>
					<div class="col-sm-2 col-2 item-fragment item-column" order-item>
						<span class="total-price">${this.$filter('currency')(products[key].totalPrice, '$', 0)}</span>
						<span class="text-normal">${order.userPayment.payment.name}</span>
					</div>
					<div class="col-sm-2 col-2 item-fragment item-column order-item">
						<span class="status">${order.statusName}</span>
						<span class="payment-detail">請在${order.expiredAt.slice(0, 10)}完成付款動作</span>
					</div>					
					<div class="col-sm-2 col-2 item-fragment">
						<label class="text-normal">${order.userLogistic.logistic.name}</label>
					</div>
				</div>`;
		}

		return productTemplate;
	}


}


export const orderUnpaidComponent = {
	require: {
		userOrderTabs: '^^'
	},
	template: orderUnpaidTemplate,
	controller: OrderUnpaidController,
	controllerAs: '$vm',
	bindings: {
		title: '@',
		type: '@',
		itemsLimit: '<'
	}
};

