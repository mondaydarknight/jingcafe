


function editFormSelectDirective() {
	return {
		restrict: 'A',
		require: '^editForm',
		link: (scope, element, attr, controller) => {
			console.log(controller);
		}
	};
}

export const editFormSelect = editFormSelectDirective;