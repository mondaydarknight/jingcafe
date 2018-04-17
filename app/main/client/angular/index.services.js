import AppModel from './services/AppModel';
import HttpService from './services/HttpService';
import HeaderService from './services/HeaderService';
import ProductService from './services/ProductService';
import ShopService from './services/ShopService';

angular
	.module('jingcafe.services', [])
	.service('AppModel', AppModel)
	.service('HttpService', HttpService)
	.service('HeaderService', HeaderService)
	.service('ProductService', ProductService)
	.service('ShopService', ShopService)