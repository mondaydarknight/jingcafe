import materialSheetTemplate from './material-sheet.template.html';

class MaterialSheetController {

	constructor($state, $scope, $window, $document, AuthService, EventListener, HeaderService, ScrollService, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.$scope = $scope;
		this.$window = $window;
		this.$document = $document;
		this.AuthService = AuthService;
		this.EventListener = EventListener;
		this.HeaderService = HeaderService;
		this.ScrollService = ScrollService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.shopMenuItems = this.HeaderService.shopMenuItems;
		this.EventListener.on('toggleMaterialSheet', this.toggleMaterialSheet, this);
		this.materialSheet = this.$document[0].body.querySelector('.material-sheet');
		this.isActive = false;
	
		this.$window.addEventListener('resize', this.closeSheetWhenBeyondLimit());
	}

	$onDestroy() {
		this.$window.removeEventListener('resize', this.closeSheetWhenBeyondLimit());
	}

	set isMenuToggleActive(isMenuToggleActive) {
		this._isMenuToggleActive = isMenuToggleActive;
	}

	get isMenuToggleActive() {
		return this._isMenuToggleActive;
	}

	closeSheetWhenBeyondLimit() {
		const screenResponsiveSmallSize = this.CONSTANTS.SCREEN.SIZE_SM;	
		const self = this;

		return (event) => {			
			if (event.target.innerWidth > screenResponsiveSmallSize) {
				self.toggleMaterialSheet(false);
			}
		};
	}

	toggleMaterialSheet(isActive) {
		if (isActive !== undefined) {
			this.isActive = isActive;
		} else {
			this.isActive = !this.isActive;
		}
		
		this.ScrollService.scrollTopGeneral(500);
		
		return this.isActive ? this.materialSheet.classList.add('active') : this.materialSheet.classList.remove('active');
	}

	directToMenuPage(event, menuItem)  {
		event.preventDefault();

		if (!menuItem) {
			throw new TypeError('Undefined or empty type of menuItem');
		}

		this.$state.go(menuItem.href, menuItem.arguments);
		return this.toggleMaterialSheet(false);
	}


	/**
	 * Pure JavaScript scroll animate
	 *
	 * There are two version about animation, including linear nad ease-in-out
	 *
	 */
	scrollToTop() {
		
	}


}

export const materialSheetComponent = {
	template: materialSheetTemplate,
	controller: MaterialSheetController,
	controllerAs: '$vm',
	bindings: {}
};


