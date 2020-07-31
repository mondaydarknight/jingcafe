import userMessageNotificationTemplate from './user-message-notification.template.html';

class UserMessageNotificationController {

	constructor($sce, $templateCache) {
		'ngInject';

		this.$sce = $sce;
		this.$templateCache = $templateCache;
	}

	$onInit() {
		this.iconNotification = this.$sce.trustAsHtml(this.$templateCache.get('icon-notification'));
		this.iconCoin = this.$sce.trustAsHtml(this.$templateCache.get('icon-coin'));
	}
	


}


export const userMessageNotificationComponent = {
	template: userMessageNotificationTemplate,
	controller: UserMessageNotificationController,
	controllerAs: '$vm',
	bindings: {}
};
