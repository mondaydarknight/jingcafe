import editFormTemplate  from './edit-form.template.html';

class EditFormController {

	constructor() {
		'ngInject';


	}

	$onInit() {

	}

	$postLink() {

	}

	set viewMode(viewMode) {
		this._viewMode = viewMode;
	}

	get viewMode() {
		return this._viewMode;
	}

	set editMode(editMode) {
		this._editMode = editMode;
	}

	get editMode() {
		return this._editMode;
	}

	set visible(visible) {
		this._visible = !!visible;
	}

	get visible() {
		return this._visible;
	}

}
	

function editFormDirective() {
	return {
		restrict: 'A',
		template: '<form name="$vm.editForm"></form>',
		controller: EditFormController,
		controllerAs: '$vm',
		scope: {
			editForm: '='
		},
		link: (scope, element, attr, controller) => {
			controller.visible = attr.visible;
			controller.viewMode = controller.editMode = [];
		} 
	};
}


export const editForm = editFormDirective;
