function scrollBubble() {
	return {
		restrict: 'A',
		scope: {},
		link: (scope, element, attr, ctrl) => {
			const $window = angular.element(window);
			const $body = angular.element('html, body');

			$window.on('scroll', () => {
				$window[0].scrollY > 100 ? element.fadeIn('slow') : element.fadeOut('slow');
			});

			element.hide().on('click', (event) => $body.animate({ scrollTop: 0}, 500));

			scope.$on('destroy', () => {
				$window.off('scroll');
				element.off('click');
			})
		}
	};
}

export const scrollBubbleDirective = scrollBubble;