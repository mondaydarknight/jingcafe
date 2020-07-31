
class TemplateLoaderController {

	constructor($q, $templateRequest, $attrs) {
		'ngInject';

		this.$q = $q;
		this.$templateRequest = $templateRequest;
		this.$attrs = $attrs;
	}

	$onInit() {
		this.isLoadCompleted = false;

		let promises = [];
		
		this.templates = this.$attrs.templateLoader.split(',');

		this.templates.forEach((url) => {
			promises.push(this.$templateRequest(url));
		});

		this.$q.all(promises).then(() => this.isLoadCompleted = true, () => false);
	}

}

function templateLoader($rootScope, $templateCache, $compile) {
	return {
		restrict: 'A',
		scope: {
			templateLoader:'@'
		},
		template: '<h2>test scope</h2>',
		controller: TemplateLoaderController,
		bindToController: true,
		link: (scope, element, attr, ctrl) => {
			scope.$watch(() => ctrl.isLoadCompleted, (isLoadCompleted)=> {
				if (isLoadCompleted === true) {
					let html = '';
					this.templates.forEach((url) => {
						html += $templateCache.get(url);	
					});

					element.append($compile(html)($rootScope));
				}
			})
		}
	};
}

templateLoader.$inject = ['$q', '$templateRequest', '$compile'];

export const templateLoaderDirective = templateLoader;




