import verificationTemplate from './verification.template.html';

class VerificationController {

	constructor($scope) {
		'ngInject';

		this.$scope = $scope;
	}

	$onInit() {
		this.tabs = [];
		this.tabIndex = 0;
		this.$scope.$on('selectVerificationTab', (event, index) => this.selectTab(index));
	}

	$postLink() {
		
	}

	addTab(tab) {
		this.tabs.push(tab);
		
		if (this.tabs.length-1 == this.tabIndex) {
			return this.tabs[this.tabs.length-1].select(true);
		}
	}

	isFirstTab($index) {
		return this.tabIndex === 0;
	}

	isLastTab($index) {
		return this.tabIndex === this.tabs.length-1;
	}

	previous() {
		return this.selectTab(this.tabIndex-1);
	}

	next() {
		return this.selectTab(this.tabIndex+1);
	}

	switchTabMenu(toTabIndex) {
		this.tabs[this.tabIndex].select(false);
		this.tabs[toTabIndex].select(true);
		this.tabIndex = toTabIndex;
	}

	verifyTab(toTabIndex) {
		for (let index=0; index < toTabIndex; index++) {
			this.tabs[index].submit();
			if (!this.tabs[index].isComplete()) {
				break;
			}
			
			this.switchTabMenu(index + 1);
		}
	}

	selectTab(toTabIndex) {		
		if (this.tabIndex >= toTabIndex) {
			return this.switchTabMenu(toTabIndex);	
		}
		
		this.verifyTab(toTabIndex);
	}

}



export const verificationComponent = {
	transclude: true,
	template: verificationTemplate,
	controller: VerificationController,
	controllerAs: '$vm',
	bindings: {}
};

