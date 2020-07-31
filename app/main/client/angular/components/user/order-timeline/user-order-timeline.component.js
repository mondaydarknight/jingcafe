import userOrderTimelineTemplate from './user-order-timeline.template.html';

class UserOrderTimelineController {

	constructor($scope) {
		'ngInject';	

		this.$scope = $scope;
	}	

	$onInit() {
		setTimeout(() => {
			this.order = this.userOrderDetail.order;
			this.$scope.$digest();
		});
	}

	$postLink() {
		
	}

}


export const userOrderTimelineComponent = {
	require: {
		userOrderDetail: '^^'
	},	
	template: userOrderTimelineTemplate,
	controller: UserOrderTimelineController,
	controllerAs: '$vm',
	bindgins: {}
};