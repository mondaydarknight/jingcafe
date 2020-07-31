import verificationStepTemplate from './verification-step.template.html';

/************
	angular form elements
	$$animate
	$$classCache
	$$controls
	$$element
	$$parentForm
	$$success
	$dirty
	$error
	$invalid
	$name
	$pending
	$pristine
	$submitted
	$valid		
************/

class VerificationStepController {

	constructor() {
		'ngInject';
	
	}

	$onInit() {

		const tab = {
			title: () => this.title,
			select: (isSelect) => this.selected  = isSelect,
			submit: () => this.form && this.form.$setSubmitted(true),
			isComplete: () => this.form && this.form.$valid
		};

		this.selected = false;
		this.parent.addTab(tab);
	}

	$postLink() {

	}

	set selected(selected) {		
		this._selected = selected;
	}

	get selected() {
		return this._selected;
	}

}


export const verificationStepComponent = {
	require: {
		parent: '^^verification'
	},
	transclude: true,
	template: verificationStepTemplate,
	controller: VerificationStepController,
	controllerAs: '$vm',
	bindings: {
		title: '@',
		form: '<'
	}
};
