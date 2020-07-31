import notificationMessageTemplate from './notification-message.template.html';

class NotificationMessageController {

	constructor($sce, $templateCache, ShopService) {
		'ngInject';

		this.$sce = $sce;
		this.$templateCache = $templateCache;
		this.ShopService = ShopService;
	}

	$onInit() {		
		this.iconNotification = this.$sce.trustAsHtml(this.$templateCache.get('iconNotification'));
		
		this.ShopService.notifications().then((response) => {
			this.notifications = [];

			for (let key in response.data) {
				response.data[key].icon = this.$sce.trustAsHtml(this.$templateCache.get(response.data[key].icon));
				this.notifications.push(response.data[key]);
			}

		});
	}

	remove(event, index) {
		event.preventDefault();

		if (!this.notifications[index]) {
			return;
		}	

		this.notifications.splice(index, 1);

		this.ShopService.removeNotification({notificationIndex: index});
	}

}

export const notificationMessageComponent = {
	require: {
		adminHeader: '^^'
	},
	template: notificationMessageTemplate,
	controller: NotificationMessageController,
	controllerAs: '$vm',
	bindings: {}
};
