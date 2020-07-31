import Order from '../order/Order';
import orderCanceledTemplate from './order-canceled.template.html';

class OrderCanceledController extends Order
{
	constructor($scope, $state, $compile, $filter, $element, EventListener, UserService, ToolFactory, toastr, CONSTANTS) {
		'ngInject';

		super($scope, $state, $compile, $element, EventListener, UserService, ToolFactory, toastr, CONSTANTS);
		this.$filter = $filter;
	}

	$onInit() {
		this.loadTab();
	}


	buildOrderItemsView(orders) {
		let orderTemplate = '';

		for (let i=0; i<orders.length; i++) {
			let productTemplate = orders[i].products.length ? this.buildProductItemsView(orders[i], orders[i].products) : '';

			orderTemplate += `<div class="order">
				<div class="order-wrap">
					<div class="order-header">
						<div class="order-header-top">
							<span class="flex1">訂單編號: ${orders[i].id}</span>
							<span class="flex0">取消日期: <b>${orders[i].canceledAt && orders[i].canceledAt.slice(0, 10)}</b></span>
						</div>
						<div class="row order-header-bottom">
							<div class="col-sm-4 col-4 order-column">
								<label class="item-link">商品</label>
							</div>
							<div class="col-sm-2 col-2 order-column">
								<label class="item-link">單價</label>
							</div>
							<div class="col-sm-3 col-3 order-column">
								<label class="item-link">總金額</label>
							</div>
							<div class="col-sm-3 col-3 order-column">
								<label class="item-link">物流方式</label>
							</div>	
						</div>
					</div>
					<div class="order-content">
						<div class="order-content-wrap">${productTemplate}</div>
					</div>
					<div class="order-bottom cancel">
						<div class="order-column cancel-wrap">
							<div class="cancel-item">
								<div class="item-inner">
									<label class="cancel-label">取消原因</label>
									<div class="cancel-content">
										<span class="text-normal">${orders[i].cancelReason ? orders[i].cancelReason.reason : ''}</span>
									</div>
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

		for (let i=0; i<products.length; i++) {
			productTemplate += `<div class="row order-content-item">
				<div class="col-sm-4 col-4 item-fragment item-overview" ui-sref="shop.product.detail({'productId': ${products[i].id}})">
					<div class="product-thumbnail" style="background-image: url(${products[i].profile});"></div>
					<span href class="product-name">${products[i].name}</span>
					<span class="product-quantity">x ${products[i].quantity}</span>
				</div>
				<div class="col-sm-2 col-2 item-fragment">
					<span class="product-price">${this.$filter('currency')(products[i].price, '$NT', 0)}</span>
				</div>
				<div class="col-sm-3 col-3 item-fragment item-column">
					<span class="total-price">${this.$filter('currency')(products[i].totalPrice, '$NT', 0)}</span>
					<span class="text-normal">${order.userPayment && order.userPayment.payment.name}</span>
				</div>
				<div class="col-sm-3 col-3 item-fragment">
					<label class="text-normal">${order.userLogistic && order.userLogistic.logistic.name}</label>
				</div>
			</div>`;
		}


		return productTemplate;
	}

}


export const orderCanceledComponent = {
	require: {
		userOrderTabs: '^^'
	},
	template: orderCanceledTemplate,
	controller: OrderCanceledController,
	controllerAs: '$vm',
	bindings: {
		title: '@',
		type: '@'
	}
};

