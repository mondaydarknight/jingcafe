import shopHeaderTemplate from './shop-header.template.html';

class ShopHeaderController {

	constructor($rootScope, $scope, $uibModal, EventListener, AuthService, ShopService, toastr, CONSTANTS) {
		'ngInejct';

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.EventListener = EventListener;
		this.AuthService = AuthService;
		this.ShopService = ShopService;
		this.toastr = toastr;		
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.EventListener.on('openLoginModal', this.openLoginModal, this);
	}
	
	toggleMaterialSheet() {
		return this.EventListener.broadcast('toggleMaterialSheet');
	}


	/**
	 * Refresh the user status of authentication
	 * @param bool 	isAuthenticated
	 */
	refreshUserCurrentStatus(isAuthenticated) {
		this.isAuthenticated = isAuthenticated;
	}

	/**
	 * Open Modal login
	 * @warning 	The $uibModal open() not work in bootstrap 4 [alpha5]
	 * the solution can add object windowClass: 'show', 
	 */ 
	openLoginModal() {
		
		const modalInstance = this.$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribeBy: 'modal-body',
			component: 'loginModal',
			size: 'sm',
			backdrop: 'static',
			keyboard: false
			// appendTo: this.$navbarSelector
		});

		return modalInstance.result.then((response) => {
			
			if (response && response.trim() === 'sendMail') {
				this.toastr.success(this.CONSTANTS.SUCCESS.SEND_EMAIL);
			}

		});
	}

	directToAdminPage() {
		return this.ShopService.directToPage(this.CONSTANTS.ADMIN.URL);
	}

}



export const shopHeaderComponent = {
	template: shopHeaderTemplate,
	controller: ShopHeaderController,
	controllerAs: '$vm',
	bindings: {
		
	}
};