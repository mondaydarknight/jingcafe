import shopIntroductionTemplate from './shop-introduction.template.html';

class ShopIntroductionController {

	constructor() {
		'ngInject';
	}

	$onInit() {
		this.features = 
		[{
			image: '/assets/img/commercial/coffee-beans-and-womans-hands-700x329.jpg',
			title: '嚴選咖啡豆'
		},
		{
			image: '/assets/img/commercial/pourover.jpg',
			title: '專業萃取'
		},
		{
			image: '/assets/img/commercial/cafe-espresso.jpg',
			title: '濃縮咖啡'
		}];
	}

}


export const shopIntroductionComponent = {
	require: {
		shopBase: '^^'
	},
	template: shopIntroductionTemplate,
	controller: ShopIntroductionController,
	controllerAs: '$vm',
	bindings: {
	}
};

