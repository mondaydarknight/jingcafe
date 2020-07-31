

function sidebarToggleMenuDirective(SidebarService) {
	return {
		restrict: 'A',
		require: '^sidebarToggleItem',
		link: function(scope, element, attr, SidebarToggleItemController) {
			SidebarToggleItemController.expandMenu = () => element.slideDown();
			SidebarToggleItemController.collapseMenu = () => element.slideUp();
		}
	};
}


export const sidebarToggleMenu = sidebarToggleMenuDirective;