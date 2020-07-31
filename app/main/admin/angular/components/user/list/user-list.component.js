import userListTemplate from './user-list.template.html';

class UserListController {

	constructor($scope, $sce, $templateCache, EventListener, UserService, CONSTANTS) {

		this.$scope = $scope;
		this.$sce = $sce;
		this.$templateCache = $templateCache;
		this.EventListener = EventListener;
		this.UserService = UserService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.EventListener.broadcast('isLoaderActive', false);
		
		this.iconUser = this.$sce.trustAsHtml(this.$templateCache.get('iconUser'));
	}

}


export const userListComponent = {
	template: userListTemplate,
	controller: UserListController,
	controllerAs: '$vm',
	bindings: {
		clients: '<'
	}
}


