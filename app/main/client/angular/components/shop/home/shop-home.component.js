import shopHomeTemplate from './shop-home.template.html';

/**
 * html-loader, file-loader, url-loader 
 * 
 * If load several images from same folder.
 *
 * imort $pathFolder from './app/asseets/'
 * 
 * const cats = [
 * 		'black-cat.png', 
 * 		'blue-cat.png',
 * 		'bruise-cat.jpg'
 * ]
 * 
 * () => cats.map(name => `<img src="${pathFolder(name, true)" alt="name"}`)
 */

class ShopHomeController {

	constructor($state, $stateParams, $document, EventListener, ShopService, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$document = $document;
		this.EventListener = EventListener;
		this.ShopService = ShopService;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		if (this.$stateParams.isOpenLoginModal && this.$stateParams.isOpenLoginModal === 'true') {
			this.EventListener.broadcast('openLoginModal');
		}

		const highlightCommercial = angular.element(document.getElementById('highlight-commercial'));

		this.advertisements = [{
			img: '/assets/img/bg/shop.jpg',
			context: this.shopBase.shop.name,
			href: 'shop.about.introduction'
		}, {
			img: '/assets/img/bg/commercial-sale.jpg',
			href: 'shop.product.list',
			params: {productCategory: 'coffee_bean'}
		}, {
			img: '/assets/img/bg/jing-slider1.jpg',
			context: this.shopBase.shop.name,
			href: ''
		}];

		highlightCommercial.carousel({ interval: 5000 });
		this.renderIndicators(highlightCommercial);
	}

	renderIndicators(element) {
		const indicators = element[0].querySelector('.carousel-indicators');

		for (let i=0; i<this.advertisements.length; i++) {
			let isFirstElement = i === 0 ? 'active' : '';

			indicators.insertAdjacentHTML('beforeend', `<li data-target="#highlight-commercial" data-slide-to="${i}" class="${isFirstElement}"></li>`);
		}
	}

	directToOtherPage(advertisement) {
		if (!advertisement || !advertisement.href) {
			return ;
		}

		return this.$state.go(advertisement.href, advertisement.params);
	}
}



export const shopHomeComponent = {
	require: {
		shopBase: '^^'
	},
	template: shopHomeTemplate,
	controller: ShopHomeController,
	controllerAs: '$vm',
	bindings: {
		recommendProducts: '<'
	}
};