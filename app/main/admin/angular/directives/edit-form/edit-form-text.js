
class EditFormTextController {

	constructor() {
		'ngInject';

	}

	$onInit() {
		
		// if (!this.editModel || !this.editModel.length) {
		// 	return;
		// }
 	}

 	$postLink() {

 	}

	render() {

	}

}


function editFormTextDirective() {
	return {
		restrict: 'A',
		scope: {
			editModel: '='
		},
		bindToController: true,
		controller: EditFormTextController,
		link: (scope, element, attr, controller) => {
			// controller.editFormController = scope.$vm;
			
			// element.parent().append(`<input class="form-control" name="${attr.textName}" placeholder="${attr.textPlaceholder}">`);

			// const viewMode = {
			// 	isVisible: (visible) => visible ? element.show() : element.hide(),
				
			// };

			// controller.editFormController.addViewMode();

		}
	};
}

export const editFormText = editFormTextDirective;

