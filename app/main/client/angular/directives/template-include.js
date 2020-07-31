templateInclude.$inject = ['$compile'];

function templateInclude($compile) {
	return {
		restrict: 'A',
		link: (scope, element, attrs, ctrl) => {
			if (!attrs.templateInclude) {
				return;
			}

			const template = require(`${attrs.templateInclude}`);
			element.html(template);
			return $compile(element.contents())(scope);
		}
	};
}



export const templateIncludeDirective = templateInclude;