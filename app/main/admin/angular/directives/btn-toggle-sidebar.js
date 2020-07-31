
function btnToggleSidebarDirective(SidebarService) {
	return {
		restrict: 'A',
		template: '<i class="fa fa-bars"></i>',
		link: (scope, element, attr, controller) => {
			element.on('click', (event) => {
				event.preventDefault();
				SidebarService.toggleMenuCollapsed();
				scope.$apply();
			});
		}
	};
}


export const btnToggleSidebar = btnToggleSidebarDirective;
