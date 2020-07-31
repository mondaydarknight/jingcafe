
class LoaderController {

	constructor($scope, $element, EventListener) {
		this.$scope = $scope;
		this.$loader = $element.find('div.loader');
		this.EventListener = EventListener;
	}

	$onInit() {
		this.initLoaderService();
	}

	$postLink() {
		
	}

	initLoaderService() {
		this.EventListener.on('isLoading', this.isLoading, this);
		this.$scope.$on('destroy', () => this.EventListener.off('isLoading'));
	}

	isLoading(isActive) {
		return isActive ? this.$loader.addClass('active') : this.$loader.removeClass('active');
	}


}

function loader() {
	return {
		restrict: 'A',
		scope: {},
		template: `<div class="loader loader-{{::$vm.loaderName}}" data-text="" data-blink></div>`,
		controller: LoaderController,
		controllerAs: '$vm',
		link: (scope, element, attr, controller) => {
			controller.loaderName = attr.loader;

			if (attr.loader === 'bounced') {
				element.find('.loader').html('<div class="loader-container">\
					<span class="bounced-item"></span>\
					<span class="bounced-item"></span>\
					<span class="bounced-item"></span></div>');
			}
		}
	};
}


export const loaderDirective = loader;