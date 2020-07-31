import httpInterceptor from './httpInterceptor';


export default function routeApplication($stateProvider, $urlRouterProvider, $httpProvider, CONSTANTS) {
	$stateProvider
		.state('shop', {
			abstract: true,
			views: {
				'layout': {
					template: '<shop-base shop="$vm.shop"></shop-base>',
					controller: ['shop', function(shop) {		
						this.shop = shop.data;
					}],
					controllerAs: '$vm',
					resolve: {
						shop: ['ShopService', (ShopService) => ShopService.shopInfo().then((resp) => resp, (error) => error)]
					}
				}
			}
		})
		.state('shop.home', {
			url: '/?isOpenLoginModal',
			views: {
				'main@shop': {
					template: '<shop-home recommend-products="$vm.recommendProducts"></shop-home>',
					controller: ['$state', 'recommendProducts', 'EventListener', function($state, recommendProducts, EventListener) {
						this.recommendProducts = recommendProducts.data;
						EventListener.broadcast('isLoading', false);
					}],
					controllerAs: '$vm',
					resolve: {
						recommendProducts: ['ProductService', (ProductService) => ProductService.recommendProducts().then((response) => response, (error) => error)]
					}
				}
			}			
		})
	
		.state('shop.about', {
			url: '/about',
			views: {
				'main@shop': {
					template: '<div ui-view="section" ng-cloak autoscroll="true"></div>'
				}
			},
			shopMenu: {
				name: 'about',
				mainSubject: true,
				title: '關於'
			}
		})

		.state('shop.about.introduction', {
			url: '/introduction',
			views: {
				'section': {
					template: '<shop-introduction></shop-introduction>',
					controller: ['EventListener', (EventListener) => EventListener.broadcast('isLoading', false)],
				}
			},
			shopMenu: {
				mainSubject: false,
				title: '品牌介紹',
				icon: 'fa fa-book'
			}
		})

		.state('shop.register', {
			url: '/register',
			views: {
				'main@shop': {
					template: '<user-register product="$vm.product"></user-register>',
					controller: ['latestProduct', 'EventListener', function(latestProduct, EventListener) {
						this.product = latestProduct.data;
						EventListener.broadcast('isLoading', false);
					}],
					controllerAs: '$vm',
					resolve: {
						latestProduct: ['ProductService', (ProductService) => ProductService.latestProduct()]
					} 
				}
			}
		})

		.state('shop.resend-email', {
			url: '/resend-email/:userId',
			views: {
				'main@shop': {
					template: '<shop-resend-email></shop-resend-email>',
					controller: ['EventListener', (EventListener) => EventListener.broadcast('isLoading', false)],
					controllerAs: '$vm'
				}
			}
		})

		.state('shop.reset-password', {
			url: '/reset-password/:userId/:secretKey',
			views: {
				'main@shop': {
					template: '<shop-reset-password></shop-reset-password>',
					controller: ['EventListener', (EventListener) => EventListener.broadcast('isLoading', false)]
				}
			}
		})
		
		.state('shop.settle-payment', {
			url: '/settle-payment/:secretKey/:secretId',
			views: {
				'main@shop': {
					template: '<settle-payment></settle-payment>',
					controller: ['EventListener', (EventListener) => EventListener.broadcast('isLoading', false)]
				}
			}
		})

		.state('shop.product', {
			abstract: true,
			url: '/product',
			views: {
				'main@shop': {
					template: '<product-interface></product-interface>'
				}
			},
			shopMenu: {
				name: 'product',
				mainSubject: true,
				title: '產品'
			}
		})
		.state('shop.product.list', {
			url: '/list/:productCategory',
			views: {
				'section': {
					template: '<product-overview products="$vm.products"></product-overview>',
					controller: ['products', 'ProductService', 'EventListener', function(products, ProductService, EventListener) {
						EventListener.broadcast('isLoading', false);
						
						if (!products || products.status !== 200) {
							return ProductService.directToDefaultProductList();
						}

						this.products = products.data;
					}],
					controllerAs: '$vm',
					resolve: {	
						products: ['$stateParams', 'ProductService', ($stateParams, ProductService) => {
							return ProductService.overview($stateParams).then((response) => response, (error) => error);
						}]
					}
				}
			}
		})
		.state('shop.product.detail', {
			url: '/detail/:productId',
			views: {
				'section': {
					template: '<product-detail product="$vm.product" recommend-products="$vm.recommendProducts"></product-detail>',
					controller: ['product', 'recommendProducts', 'EventListener', function(product, recommendProducts, EventListener) {
						EventListener.broadcast('isLoading', false);
						this.product = product.data;
						this.recommendProducts = recommendProducts.data;
					}],
					controllerAs: '$vm',
					resolve: {
						product: ['$stateParams', 'ProductService', 'CONSTANTS', ($stateParams, ProductService, CONSTANTS) => {					
							return ProductService.detail($stateParams).then((product) => product, (error) => error);
						}],
						recommendProducts: ['ProductService', (ProductService) => ProductService.recommendProducts()]
					} 
				}
			}	
		})
	
		.state('shop.service', {
			abstract: true,
			url: '/service',
			views: {
				'main@shop': {
					template: '<div ui-view="section" ng-cloak autoscroll="true"></div>'
				}
			},
			shopMenu: {
				name: 'service',
				mainSubject: true,
				title: '服務中心'
			}
		})
		.state('shop.service.order-statement', {
			url: '/order-statement',
			views: {
				'section': {
					template: '<customer-center title="$vm.title" context="$vm.context"><purchase-progress></purchase-progress></customer-center>',
					controller: ['orderStatement', 'EventListener', function(orderStatement, EventListener) {
						EventListener.broadcast('isLoading', false);

						if (!orderStatement.data) {
							throw new TypeError('Unknown data of purchase statement');
						}

						this.title = orderStatement.data.title;
						this.context = orderStatement.data.context;
					}],
					controllerAs: '$vm',
					resolve: {
						orderStatement: ['ShopService', (ShopService) => ShopService.statement({type: 'order'})]
					}	
				}
			},
			shopMenu: {
				mainSubject: false,
				title: '訂購流程',
				icon: 'fa fa-clipboard'
			}
		})
		.state('shop.service.purchase-statement', {
			url: '/purchase-statement',
			views: {
				'section': {
					template: '<customer-center title="$vm.title" context="$vm.context"></customer-center>',
					controller: ['purchaseStatement', 'EventListener', function(purchaseStatement, EventListener) {
						EventListener.broadcast('isLoading', false);

						if (!purchaseStatement.data) {
							throw new TypeError('Unknown data of purchase statement');
						}

						this.title = purchaseStatement.data.title;
						this.context = purchaseStatement.data.context;
					}],
					controllerAs: '$vm',
					resolve: {
						purchaseStatement: ['ShopService', (ShopService) => ShopService.statement({type: 'purchase'})]
					}
				}
			},
			shopMenu: {
				mainSubject: false,
				title: '購物聲明',
				icon: 'fa fa-shopping-bag'
			}
		})
		.state('shop.service.privacy-statement', {
			url: '/privacy-statement',
			views: {
				'section': {
					template: '<customer-center title="$vm.title" context="$vm.context"></customer-center>',
					controller: ['privacyStatement', 'EventListener', function(privacyStatement, EventListener) {
						EventListener.broadcast('isLoading', false);

						if (!privacyStatement.data) {
							throw new TypeError('Unknown data of privacy statement.');
						}

						this.title = privacyStatement.data.title;
						this.context = privacyStatement.data.context;
					}],
					controllerAs: '$vm',
					resolve: {
						privacyStatement: ['ShopService', (ShopService) => ShopService.statement({type: 'privacy'})]
					}
				}
			},
			shopMenu: {
				mainSubject: false,
				title: '隱私權聲明',
				icon: 'fa fa-lock'
			}
		})


		.state('shop.menu', {
			abstract: true,
			url: '/menu',
			views: {
				'main': {
					template: '<div ui-view="section" ng-cloak autoscroll="true"></div>',
				}
			},
			isAdmin: true,
			shopMenu: {
				name: 'menu',
				mainSubject: true,
				title: '選單'
			}
		})
		.state('shop.menu.checkout', {
			url: '/checkout',
			views: {
				'section': {
					template: '<user-checkout user="$vm.user" products="$vm.products" logistics="$vm.logistics" payments="$vm.payments" user-logistic="$vm.userLogistic" user-payment="$vm.userPayment"></user-checkout>',
					controller: ['$state', 'ProductService', 'toastr', 'CONSTANTS', 'user', 'products', 'checkoutInfo', 'EventListener',
					function($state, ProductService, toastr, CONSTANTS, user, products, checkoutInfo, EventListener) {
						EventListener.broadcast('isLoading', false);

						if (!products || !products.length) {
							toastr.warning(CONSTANTS.WARNING.CART_EMPTY);
							return ProductService.directToDefaultProductList();
						}

						if (!checkoutInfo.data) {
							toastr.error(CONSTANTS.ERROR.UNKNOWN);
							return $state.go('shop.home');
						}

						this.user = user;
						this.products = products;
						this.logistics = checkoutInfo.data.logistics;
						this.payments = checkoutInfo.data.payments;
						this.userLogistic = checkoutInfo.data.userLogistic;
						this.userPayment = checkoutInfo.data.userPayment;
					}],
					controllerAs: '$vm',
					resolve: {
						// Waiting user basic information of initialization
						user: ['$timeout', 'AuthService', ($timeout, AuthService) => $timeout(() => AuthService.user, 1000)],
						products: ['CookieFactory', (CookieFactory) => CookieFactory.get('products') || []],
						checkoutInfo: ['UserService', (UserService) => UserService.checkoutInfo().then((response) => response, (error) => error)]
					}
				}
			},
			shopMenu: {
				mainSubject: false,
				title: '結帳',
				icon: 'fa fa-dollar'				
			}
		})
		
		.state('shop.user', {
			abstract: true, 
			url: '/user',
			views: {
				'main': {
					template: '<user-interface></user-interface>'
				}
			}
		})
		.state('shop.user.information', {
			url: '/information',
			views: {
				'section': {
					template: '<user-information></user-information>',
					controller: ['EventListener', (EventListener) => EventListener.broadcast('isLoading', false)]
				}
			},
			shopMenu: {
				mainSubject: false,
				title: '介面管理',
				icon: 'fa fa-tasks'
			}
		})
		.state('shop.user.order', {
			abstract: true,
			url: '/order',
			views: {
				'section': {
					template: '<user-order-overview></user-order-overview>'
				}
			}
		})
		.state('shop.user.order.list', {
			url: '/list',
			views: {
				'panel': {
					template: '<user-order-tabs unpaid-orders="$vm.unpaidOrders"></user-order-tabs>',
					controller: ['$state', 'toastr', 'CONSTANTS', 'unpaidOrders', function($state, toastr, CONSTANTS, unpaidOrders) {
						this.unpaidOrders = unpaidOrders.data;
					}],
					controllerAs: '$vm',
					resolve: {
						unpaidOrders: ['UserService', (UserService) => UserService.unpaidOrders()]
					}		
				}
			}			
		})
		.state('shop.user.order.list.detail', {
			url: '/detail/:cacheIndex',
			views: {
				'panel': {
					template: '<user-order-detail cache-index="$vm.cacheIndex"></user-order-detail>',
					controller: ['$state', '$stateParams', 'NumberService', function($state, $stateParams, NumberService) {	
						if (!NumberService.isNormalInteger($stateParams.cacheIndex)) {
							$state.go('shop.home');
							throw new TypeError('Undefined variable cacheIndex in order detail');
						}
						
						this.cacheIndex = $stateParams.cacheIndex;
					}],
					controllerAs: '$vm'
				}
			}
		})
		
		


	$urlRouterProvider.otherwise('/');

	// $httpProvider.defaults.useXDomain - true;
	// $httpProvider.defaults.headers.common = 'Content-Type: application/json';
	// delete $httpProvider.defaults.headers.common['X-Requested-With'];
	
	$httpProvider.interceptors.push(httpInterceptor);

}