
const loaderDecorator = {
	default: '',
	bounced: '<div class="loader-container">\
		<span class="bounced-item"></span>\
		<span class="bounced-item"></span>\
		<span class="bounced-item"></span></div>'
};

class LoaderController {

	constructor($scope, $element, EventListener) {
		'ngInject';

		this.$scope = $scope;
		this.$element = $element;
		this.EventListener = EventListener;
	}

	$postLink() {
		this.$loader = this.$element.find('.loader');
		this._initLoaderService();
	}

	_initLoaderService() {
		this.decorateLoader();
		this.EventListener.on('isLoaderActive', this.isLoaderActive, this);
		this.$scope.$on('destroy', () => this.EventListener.off('isLoaderActive'));
	}

	decorateLoader() {
		if (this.loaderType in loaderDecorator) {
			this.$loader[0].innerHTML = loaderDecorator[this.loaderType];
		}
	}

	isLoaderActive(isActive) {
		return isActive ? this.$loader.addClass('active') : this.$loader.removeClass('active');
	}

}


function loaderDirective() {
	return {
		restrict: 'A',
		scope: {},
		template: '<div class="loader loader-{{::$vm.loaderType}}" data-text="" data-blink></div>',
		controller: LoaderController,
		controllerAs: '$vm',
		link: (scope, element, attr, controller) => {
			controller.loaderType = attr.loader;
		}
	};
}


export const loader = loaderDirective;
