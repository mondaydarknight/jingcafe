import AppModel 		from './services/AppModel';
import AuthService 		from './services/AuthService';
import ErrorHandler 	from './services/ErrorHandler';
import HttpService 		from './services/HttpService';
import HeaderService 	from './services/HeaderService';
import NumberService 	from './services/NumberService';
import ProductService 	from './services/ProductService';
import ScrollService 	from './services/ScrollService';
import ShopService 		from './services/ShopService';
import UserService 		from './services/UserService';



angular
	.module('jingcafe.services', [])
	.service('AppModel', AppModel)
	.service('AuthService', AuthService)
	.service('ErrorHandler', ErrorHandler)
	.service('HeaderService', HeaderService)
	.service('HttpService', HttpService)
	.service('NumberService', NumberService)
	.service('ProductService', ProductService)
	.service('ScrollService', ScrollService)
	.service('ShopService', ShopService)
	.service('UserService', UserService)