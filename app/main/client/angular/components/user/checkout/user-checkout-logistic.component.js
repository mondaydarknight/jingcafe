import userCheckoutLogisticTemplate from './user-checkout-logistic.template.html';


class UserCheckoutLogisticController {

	constructor($scope, $document, $uibModal, $filter) {
		'ngInject';
		
		this.$scope = $scope;
		this.$document = $document;
		this.$uibModal = $uibModal;
		this.$filter = $filter;
	}

	$onInit() {
		this.logisticItem = this.$document[0].body.querySelector('.logistic-item');
		this.userBasicInfoCheckbox = this.$document[0].body.querySelector('input.user-basic-info');
		this.isRenderUserInfo = true;
		this.toggleRenderUserInfo = this._toggleRenderUserInfo();
		this._init();

		this.$scope.$watch(() => (this.userCheckout.params.productTotalPrice), () => this._refreshLogisticFeeTemplate());
	}

	selectLogistic() {
		const selectLogisticModal = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'selectLogisticModal',
			backdrop: 'static',
			keyboard: false,
			resolve: {
				logistics: () => this.userCheckout.logistics
			}
		});

		selectLogisticModal.result.then((response) => {		
			if (response) {
				this.logisitcFee = response.fee;
				angular.extend(this.userCheckout.params.logistic, response);	
				return this._renderLogisticView();
			}
		});
	}

	_init() {
		this.toggleRenderUserInfo();
		// if (this.userCheckout.userLogistic) {
		// 	this._setUserLogistic();
		// }
	}

	_setUserLogistic() {
		let logistic;

		for (let i=0; i<this.userCheckout.logistics.length; i++) {
			if (this.userCheckout.logistics[i].id === this.userCheckout.userLogistic.logisticId) {
				logistic = this.userCheckout.logistics[i];
				break;
			}
		}
		
		if (logistic) {
			return;
		}
		
		angular.extend(this.userCheckout.params.logistic, logistic, {address: this.userCheckout.userLogistic.address});
		this.logisitcFee = this.userCheckout.params.logistic.fee;
		return this;
	}

	_toggleRenderUserInfo() {
		let isRenderUserInfo = false;

		const renderUserInfo = () => {
			this.userBasicInfoCheckbox.checked = true;
			angular.extend(this.userCheckout.params.logistic, this.userCheckout.user);
		};

		const removeUserInfo = () => {
			this.userBasicInfoCheckbox.checked = false;

			for (let key in this.userCheckout.user) {
				if (key in this.userCheckout.params.logistic) {
					delete this.userCheckout.params.logistic[key];
				}
			}
		};

		return (event) => {
			if (event) {
				event.preventDefault();
				event.stopPropagation();				
			}

			isRenderUserInfo = !isRenderUserInfo;
			return isRenderUserInfo ? renderUserInfo() : removeUserInfo();
		};
	}

	_refreshLogisticFeeTemplate() {
		if (Object.prototype.toString.call(this.logisitcFee) !== '[object Number]') {
			this.logisticItem.style.display = 'none';
			return;
		}

		return this._renderLogisticView();
	}

	_renderLogisticView() {
		const logisticItemSubContent = this.logisticItem.querySelector('.logistic-item-sub-content');

		this.logisticItem.style.display = 'block';
		
		if (this.userCheckout.params.productTotalPrice < this.userCheckout.shopBase.shop.freeLogisticPrice) {
			this.userCheckout.params.logistic.fee = this.logisitcFee;
			logisticItemSubContent.innerHTML = `<span class="logistic-item-fee">${this.$filter('currency')(this.logisitcFee, '$ ', 0)}</span>`;
		} else {
			this.userCheckout.params.logistic.fee = 0;
			logisticItemSubContent.innerHTML = `<span class="logistic-item-fee disabled">${this.$filter('currency')(this.logisitcFee, '$ ', 0)}</span><span class="after-fee">$ ${0}</span>`;	
		}
	}
}

export const userCheckoutLogisticComponent = {
	require: {
		userCheckout: '^'
	},
	template: userCheckoutLogisticTemplate,
	controller: UserCheckoutLogisticController,
	controllerAs: '$vm',
	bindings: {}
};
	
