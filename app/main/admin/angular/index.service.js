
import HttpService 		from './services/HttpService';

import AuthService 		from './services/AuthService';
import ErrorHandler 	from './services/ErrorHandler';
import SidebarService 	from './services/SidebarService';
import ShopService 		from './services/ShopService';
import ProductService 	from './services/ProductService';
import OrderService 	from './services/OrderService';
import UserService		from './services/UserService';



angular.module('jingcafe.admin.services', [])
	
	.service('AuthService', AuthService)
	.service('ErrorHandler', ErrorHandler)
	.service('SidebarService', SidebarService)
	.service('ShopService', ShopService)
	.service('HttpService', HttpService)
	.service('ProductService', ProductService)
	.service('OrderService', OrderService)
	.service('UserService', UserService)

