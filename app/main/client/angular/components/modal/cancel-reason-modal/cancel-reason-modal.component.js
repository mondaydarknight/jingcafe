import cancelReasonModalTemplate from './cancel-reason-modal.template.html';

class CancelReasonModalController {

	constructor(UserService) {
		'ngInject';

		this.UserService = UserService;
	}

	$onInit() {
		this.orderId = this.resolve.orderId;
		this.reasons = this.resolve.reasons.data;
	}

	cancel() {
		this.modalInstance.dismiss();
	}

	confirm($event) {
		$event.preventDefault();
		this.UserService.cancelOrder({orderId: this.orderId, reasonId: this.reasonId})			
			.then((response) => this.modalInstance.close(response), (error) => this.modalInstance.close(error));
	}

	set orderId(orderId) {
		this._orderId = orderId;
	}

	get orderId() {
		return this._orderId;		
	}

	set reasons(reasons) {
		this._reasons = reasons || [];
	}

	get reasons() {
		return this._reasons;
	}

}


export const cancelReasonModalComponent = {
	template: cancelReasonModalTemplate,
	controller: CancelReasonModalController,
	controllerAs: '$vm',
	bindings: {
		resolve: '<',
		modalInstance: '<'
	}
}


