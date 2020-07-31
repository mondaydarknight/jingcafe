import Order from '../order/Order';
import orderProducedTemplate from './order-produced.template.html';

class OrderProducedController extends Order
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
							<span class="flex0">訂購狀態: ${orders[i].createdAt.slice(0, 10)}</span>	
						</div>
						<div class="row order-header-bottom with-column">
							<div class="col-sm-4 col-4 order-column">
								<label class="item-link">商品</label>
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
							<div class="col-sm-2 col-2 order-column">
								<label class="item-link">配送天數</label>
							</div>	
						</div>
					</div>
					<div class="order-content">
						<div class="order-content-wrap">${productTemplate}</div>
					</div>
					<div class="order-bottom">
						<div class="order-column">
							<div class="tag-wrap">
								<a href class="btn btn-info btn-sm no-transform" ui-sref="shop.user.order.list.detail({'cacheIndex': ${i}})">查看明細</a>
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
				<div class="col-sm-4 col-4 item-fragment item-overview"
					 ui-sref="shop.product.detail({'productId': ${products[i].id}})">
					<div class="product-thumbnail" style="background-image: url(${products[i].profile});"></div>
						<span href class="product-name">${products[i].name}</span>
						<span class="product-quantity">x ${products[i].quantity}</span>
					</div>
					<div class="col-sm-2 col-2 item-fragment item-column">
						<span class="total-price">${this.$filter('currency')(products[i].totalPrice, '$NT', 0)}</span>
						<span class="text-normal">${order.userPayment && order.userPayment.payment.name}</span>
					</div>
					<div class="cols-sm-2 col-2 item-fragment">
						<span class="status">${order.statusName}</span>
					</div>
					<div class="col-sm-2 col-2 item-fragment">
						<span class="text-normal">${order.userLogistic && order.userLogistic.logistic.name}</span>
					</div>					
					<div class="col-sm-2 col-2 item-fragment item-column">
						<label class="text-normal">${order.userLogistic && order.userLogistic.logistic.average_time}</label>
					</div>
				</div>`;
		}

		return productTemplate;
	}
	

}

export const orderProducedComponent = {
	require: {
		userOrderTabs: '^^'
	},
	template: orderProducedTemplate,
	controller: OrderProducedController,
	controllerAs: '$vm',
	bindings: {
		title: '@',
		type: '@'
	}
};


