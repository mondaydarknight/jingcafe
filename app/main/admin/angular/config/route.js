
import httpInterceptor from './httpInterceptor';


export default function routeApplication($stateProvider, $urlRouterProvider, $httpProvider, CONSTANTS) {
	$stateProvider
		.state('admin', {
			abstract: true,
			views: {
				'layout': {
					template: '<admin-layout shop="$vm.shop"></admin-layout>',
					controller: ['shop', function(shop) {
						this.shop = shop.data;
					}],
					controllerAs: '$vm',
					resolve: {
						shop: ['ShopService', (ShopService) => ShopService.shop()]
					}
				}
			}			
		})

		.state('admin.home', {
			abstract: true,
			url: '/home',			
			views: {
				'main@admin': {
					template: '<div ui-view="section" autoscroll="true" ng-cloak></div>'
				}
			},
			sidebarMeta: {
				mainList: true,
				icon: 'fa fa-home',
				title: '大廳'
			}
		})
		.state('admin.home.index', {
			url: '/',
			views: {
				'section': {
					template: '<admin-lobby></admin-lobby>'
				}
			}
		})
		.state('admin.home.setting', {
			url: '/setting',
			views: {
				'section': {
					template: '<setting></setting>'
				}
			},
			sidebarMeta: {
				mainList: false,
				icon: 'fa fa-cog',
				title: '設定'
			}
		})

		.state('admin.client', {
			abstract: true,
			url: '/client',
			views: {
				'main@admin': {
					template: '<div ui-view="section" autoscroll="true" ng-cloak></div>'
				}
			},
			sidebarMeta: {
				mainList: true,
				icon: 'fa fa-user',
				title: '使用者'
			}
		})

		.state('admin.client.list', {
			url: '/list',
			views: {
				'section': {
					template: '<user-list clients="$vm.clients"></user-list>',
					controller: ['clients', function(clients) {
						this.clients = clients.data;
					}],
					controllerAs: '$vm',
					resolve: {
						clients: ['UserService', (UserService) => UserService.all()]
					}	
				}
			},
			sidebarMeta: {
				title: '用戶管理'
			}
		})

		.state('admin.order', {
			url: '/order',
			views: {
				'main@admin': {
					template: '<div ui-view="section" autoscroll="true" ng-cloak></div>'
				}
			},
			sidebarMeta: {
				mainList: true,
				icon: 'fa fa-list-alt',
				title: '訂單'
			}
		})
		.state('admin.order.overview', {
			url: '/overview',
			views: {
				'section': {
					template: '<order-overview composition="$vm.composition" orders="$vm.orders"></order-overview>',
					controller: ['$state', 'composition', 'orders', function($state, composition, orders) {
						this.composition = composition.data;
						this.orders = orders.data;
					}],
					controllerAs: '$vm',
					resolve: {
						composition: ['OrderService', (OrderService) => OrderService.composition()],
						orders: ['OrderService', (OrderService) => OrderService.dateTime()]
					}
				}
			},
			sidebarMeta: {
				title: '訂單管理'
			}
		})

		.state('admin.product', {
			abstract: true,
			url: '/product',
			views: {
				'main@admin': {
					template: '<div ui-view="section" autoscroll="true" ng-cloak></div>',
				}
			},
			sidebarMeta: {
				mainList: true,
				icon: 'fa fa-coffee',
				title: '產品'
			}
		})
		.state('admin.product.overview', {
			url: '/overview',
			views: {
				'section': {
					template: '<product-overview products="$vm.products"></product-overview>',
					controller: ['$state', 'products', function($state, products) {
						this.products = products.data;
					}],
					controllerAs: '$vm',
					resolve: {
						products: ['ProductService', (ProductService) => ProductService.all().then((resp)=> resp, (error) =>error)]
					}
				}
			},
			sidebarMeta: {
				title: '產品管理'
			}
		})

		.state('admin.product.upload', {
			url: '/upload/:product',
			views: {
				'section': {
					template: '<product-upload product="$vm.product"></product-upload>',
					controller: ['$state', '$stateParams', function($state, $stateParams) {
						this.product = $stateParams.product ? JSON.parse($stateParams.product) : null;
					}],
					controllerAs: '$vm',			
				}
			},
			sidebarMeta: {
				title: '產品上傳'
			}
		})

		.state('login', {
			url: '/login',
			views: {
				'layout': {
					template: '<admin-login></admin-login>'
				}
			}
		})


	$urlRouterProvider.otherwise('/login');


	$httpProvider.interceptors.push(httpInterceptor);

}


