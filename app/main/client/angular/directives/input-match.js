
function inputMatchDirective() {
	return {
		require: 'ngModel',
		restrict: 'A',
		link: (scope, element, attrs, ngModel) => {
			const validate = (value) => {
				let isValid = scope.$eval(attrs.inputMatch) === value;

				ngModel.$setValidity('input-match', isValid);
				return isValid ? value : undefined;
			};

			ngModel.$parsers.unshift(validate);
	
			scope.$watch(attrs.inputMatch, (value) => {
				ngModel.$setViewValue(ngModel.$viewValue);
				validate(ngModel.$viewValue);
			});
		}
	};
}

export const inputMatch = inputMatchDirective;


