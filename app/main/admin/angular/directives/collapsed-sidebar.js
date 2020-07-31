
function collapsedSidebarDirective($timeout, SidebarService, Util) {
	return {
		restrict: 'A',
		require: '^adminSidebar',
		link: (scope, element, attr, controller) => {
			const $window = angular.element(window);
			const calculateMenuHeight = () => element[0].childNodes[0].clientHeight - 84;
			
			const onWindowClick = (event, selector) => {
				// if (!Util.isDescendant(selector, event.target) && event.originalEvent
				//  && !event.originalEvent.$sidebarEventProcessed && !SidebarService.isMenuCollapsed
				//   && SidebarService.isCurrentMenuHidden()) {
				// 	event.originalEvent.$sidebarEventProcessed = true;
				// 	$timeout(() => SidebarService.isMenuCollapsed = true, 10);
				// }
			};
			
			const onWindowResize = (event) => {
				let newMenuHeight = calculateMenuHeight();
				if (SidebarService.isCurrentMenuCollapsed() !== SidebarService.isMenuCollapsed 
					&& controller.menuHeight !== newMenuHeight) {

					controller.menuHeight = newMenuHeight;
					SidebarService.isMenuCollapsed = SidebarService.isCurrentMenuCollapsed();
					scope.$apply();
				}
			};

			controller.menuHeight = calculateMenuHeight();

			$window.on('click', (event) => onWindowClick(event, element[0]));
			$window.on('resize', (event) => onWindowResize(event));

			scope.$on('destroy', () => {
				$window.off('click').off('resize');
			});
		}
	};
}



export const collapsedSidebar = collapsedSidebarDirective;

