
function sidebarTogglerDirective(SidebarService) {
	return {
		restrict: 'A',
		require: '^sidebarToggleItem',
		link: (scope, element, attr, SidebarToggleItemController) => {

			/** 
			 * If the whole sidebar is collapsed and this item has sublist, we need to open sidebar.
			 * This should not affect mobiles because on mobiles sidebar should be hidden at all.
			 */

			element.on('click', (event) => {
				if (SidebarService.isMenuCollapsed) {
					SidebarService.isMenuCollapsed = false;
					return scope.$apply();
					// return SidebarToggleItemController.expand();
				}
				
				return SidebarToggleItemController.toggle();
			});

			// scope.$on('destroy', element.off('click'));
		}
	};
}

export const sidebarToggler = sidebarTogglerDirective;

