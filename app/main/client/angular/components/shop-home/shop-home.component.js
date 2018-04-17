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

	constructor() {
		'ngInject';
	}

	$onInit() {

	}

	$postLink() {
		
	}

}





export const shopHomeComponent = {
	template: shopHomeTemplate,
	controller: ShopHomeController,
	controllerAs: '$vm',
	bindings: {
		
	}
};