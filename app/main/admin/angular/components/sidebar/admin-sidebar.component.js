import adminSidebarTemplate from './admin-sidebar.template.html';


class AdminSidebarController {

	constructor($state, SidebarService) {
		'ngInject';

		this.$state = $state;
		this.SidebarService = SidebarService;
	}

	$onInit() {

	}	

	$postLink() {
		this.menuItems = this.SidebarService.staticMenuItems;
	}


	hoverItem($event) {
		this.hoverElementTop = $event.currentTarget.getBoundingClientRect().top - 66;
		this.hoverElementHeight = $event.currentTarget.clientHeight;
	}

	/**
	 * Direct to other single page.
	 * Determine current state item is subItem and direct.
	 * 
	 */
	directToOtherPage($event, item) {
		$event.preventDefault();
		$event.stopPropagation();

		if (item && !item.subMenuItems) {
			return this.$state.go(item.href);	
		} else if (item && item.subMenuItems && item.subMenuItems.length == 0) {
			return this.$state.go(item.href);
		}

	}

}

export const adminSidebarComponent = {
	template: adminSidebarTemplate,
	controller: AdminSidebarController,
	controllerAs: '$vm',
	bindings: {}
};











