
function cartProductCancel() {
	return {
		restrict: 'A',
		scope: {},

		link: (scope, element, attrs, ctrl) => {
			const $cartElement = jQuery(element);

			scope.$on('cartProductCancel', (event) => $cartElement.fadeOut(1000));
		}
	};
}

// cartCancelDirective.$inject = [''];

export const cartProductCancelDirective = cartProductCancel;
