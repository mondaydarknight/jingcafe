import AlertTemplate from './alert.template.html';

class AlertController {

	constructor($scope, EventListener, ToolFactory, $timeout, CONSTANTS) {
		'ngInject';

		this.$scope = $scope;
		this.EventListener = EventListener;
		this.ToolFactory = ToolFactory;
		this.$timeout = $timeout;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.setAlertConfiguration(this.alertClass, this.alertMessage);
		this.registerAlertMessageCallback();
	}

	set alert(alert) {
		if (!angular.isObject(alert)) {
			return console.log(`The argument alert ${alert} has wrong format`);
		}

		this._alert = alert;
	}

	get alert() {
		return this._alert;
	}

	setAlertConfiguration(alertClass, alertMessage) {
		if (!alertClass || !this.CONSTANTS.ALERT.hasOwnProperty(alertClass)) {
			return console.error(`Unknown alert status: ${alertMessage.status}`);
		}

		this.alert = angular.extend(this.CONSTANTS.ALERT[alertClass], {message: alertMessage || null});
	}

	/**
	 * Register the event to service when receiving the alert message.
	 */
	registerAlertMessageCallback() {
		this.$scope.$on('alert', (event, alert) => {
			if (alert && alert.hasOwnProperty('class') && alert.hasOwnProperty('message')) {
				return this.setAlertConfiguration(alert.class, alert.message);
			}
		});

		// this.EventListener.on('alertMessage', (message) => {			
		// 	this.$timeout(() => this._alert.message = message);	
		// 	console.log(this.alert);
		// });

		// this.$scope.$destroy(() => {
		// 	this.EventListener.off('alertMessage');
		// });
	}


}


export const alertComponent = {
	template: AlertTemplate,
	controller: AlertController,
	controllerAs: '$vm',
	bindings: {
		alertClass: '<',
		alertMessage: '<'
		// alertElement: '<'
	}
};


