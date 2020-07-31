
class SidebarToggleItemController {

	constructor($scope, $state, $element, $attrs, SidebarService) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.$element = $element;
		this.$attrs = $attrs;
		this.SidebarService = SidebarService;
	}

	$onInit() {
		let menuItem = this.$scope.$eval(this.$attrs.sidebarToggleItem);

		if (menuItem && menuItem.subMenuItems && menuItem.subMenuItems.length) {
			this.setupToggleEvent();
		}

		// this.$scope.$on('startChangeStart', (event) => {
		// 	event.preventDefault();

		// 	if (this.$element.hasClass('selected')) {
		// 		this.$element.removeClass('selected');
		// 	}
		// });

		// this.$scope.$on('startChangeSuccess', (event) => {
		// 	if (this.$state.indexOf(menuItem.href)) {
		// 		this.$element.addClass('selected');	
		// 	}			
		// });
	}

	setupToggleEvent() {
		this.isActiveSubMenuItems = true;
	}

	toggle() {
		if (this.isActiveSubMenuItems) {
			return this.$element.hasClass('expanded') ? this.collapse() : this.expand();
		}
	}

	expand() {
		return this.expandMenu() && this.$element.addClass('expanded');
	}

	collapse() {
		return this.collapseMenu() && this.$element.removeClass('expanded');
	}

	/**
	 * Contain element slideDown animation of sidebar-toggle-menu directive.
	 */ 
	expandMenu() {
	}

	/** 
 	 * Contain element slideUp animation of sidebar-toggle-menu directive.
 	 */
	collapseMenu() {
	}

}

function sidebarToggleItemDirective() {
	return {
		restrict: 'A',
		controller: SidebarToggleItemController
	};
}

export const sidebarToggleItem = sidebarToggleItemDirective;




