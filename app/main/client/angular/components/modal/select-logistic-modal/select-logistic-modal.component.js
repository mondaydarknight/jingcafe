import selectLogisticModalTemplate from './select-logistic-modal.template.html';


class SelectLogisticModalController {

	constructor($window, $scope, $document, ToolFactory, CONSTANTS) {
		'ngInject';

		this.$window = $window;
		this.$scope = $scope;
		this.$document = $document;
		this.ToolFactory = ToolFactory;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.$alert = angular.element(this.$document[0].body.querySelector('.alert'));
		this.logistics = this.resolve.logistics;	
		this.registerEventListener();
	}

	displayDangerAlert(isDisplay) {
		isDisplay ? this.$alert.slideDown() : this.$alert.hide();
	}
 
	registerEventListener() {

		this.$window.addEventListener('message', (event) => {
			
			const target = event.target || event.srcElement;

			if (target.location.href !== this.$window.location.href) {
				return;
			}

			if (!event.data || !event.data.address) {
				throw new TypeError('Undefined address in browser message.');
			}

			// render logsitic item view
			let logisticId = parseInt(event.data.logisticId, 10);

			if (Object.prototype.toString.call(logisticId) !== '[object Number]') {
				throw new TypeError('Undefined number in logisticId.');
			}

			this.activeLogisticId = logisticId;
			this.address = event.data.address;
			this.displayDangerAlert(false);
			
			return !this.$scope.$$phase && this.$scope.$digest();
		}, false);		
	}

	cancel() {
		return this.modalInstance.dismiss();
	}

	directToSelectLogisticPage(index, logistic) {
		const allowedParams = ['brand', 'profile', 'url'];
		let params = {};

		for (let key in logistic) {
			if (allowedParams.indexOf(key) > -1) {
				params[key] = logistic[key];
			}
		}

		params.logisticId = index;
		
		return this.$window.open(`${this.CONSTANTS.URL.LOCAL.LOGISTIC}?${this.ToolFactory.getUrlQueryParameters(params)}`);
	}

	submit() {
		if (typeof this.activeLogisticId === 'undefined' || !this.address) {
			return this.displayDangerAlert(true);
		}
		
		let logsitic = this.logistics[this.activeLogisticId];


		logsitic.address = this.address;
		return this.modalInstance.close(logsitic);
	}
	

}


export const selectLogisticModalComponent = {
	template: selectLogisticModalTemplate,
	controller: SelectLogisticModalController,
	controllerAs: '$vm',
	bindings: {
		modalInstance: '<',
		resolve: '<'
	}
};

