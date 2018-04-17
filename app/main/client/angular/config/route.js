
export default function routeApplication($stateProvider, $urlRouterProvider, CONSTANTS) {
	$stateProvider
		.state('shop', {
			abstract: true,
			views: {
				'shop@': {
					template: '<shop-base shop-info="$vm.shopInfo"></shop-base>',
					controller: ['shopInfo', function(shopInfo) {					
						this.shopInfo = shopInfo;
					}],
					controllerAs: '$vm',
					resolve: {
						shopInfo: ['ShopService', (ShopService) => {
							return ShopService.getShopLayoutInfo();
						}]						
					}
				}
			}
		})
		.state('shop.home', {
			url: '/',
			views: {
				'main': {
					template: '<shop-home></shop-home>'
				}
			},
			shopMenu: {
				mainSubject: true,
				// CONSTANTS instead.
				title: '關於'
			}
		})
		
		.state('shop.register', {
			url: '/register',
			template: '<register></register>'
		})
		
		.state('shop.product', {
			abstract: true,
			views: {
				'main': {
					template: '<product-interface categories="$vm.categories"></product-interface>',
					controller: ['categories', function(categories) {
						this.categories = categories;
					}],
					controllerAs: '$vm'
				}
			},
			resolve: {
				categories: ['ProductService', (ProductService) => {
					return ProductService.getProductCategory();
				}]
			},
			shopMenu: {
				mainSubject: true,
				title: '產品'
			}
		})
		.state('shop.product.list', {
			url: '/product/:productCategory',
			views: {
				'product': {
					template: '<product-overview products="$vm.products"></product-overview>',
					controller: ['products', function(products) {
						this.products = products;
					}],
					controllerAs: '$vm'
				}
			},
			resolve: {	
				products: ['$stateParams', 'ProductService', ($stateParams, ProductService) => {
					return ProductService.getProducts($stateParams);
				}]
			},
			shopMenu: {
				mainSubject: false,
				title: '產品總覽'
			}
		})
		.state('shop.product.detail', {
			url: '/product/detail/:productId/:serialId',
			views: {
				'product': {
					template: '<product-detail></product-detail>',
					controller: ['ProductService', function(ProductService) {

					}],
					controllerAs: '$vm' 
				}
			},
			resolve: {

			}
			
		})
		.state('shop.product.production', {
			url: '/production',
			shopMenu: {
				mainSubject: false,
				title: '出貨流程'
			}
		})


	$urlRouterProvider.otherwise('/');

}