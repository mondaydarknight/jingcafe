import CookieFactory 			from './factories/CookieFactory';
import DOMFactory				from './factories/DOMFactory';
import EventListener 			from './factories/EventListener';
import HttpInterceptor 			from './factories/HttpInterceptor';

import SessionStorageFactory 	from './factories/SessionStorageFactory';
import ToolFactory 				from './factories/ToolFactory';

angular
	.module('jingcafe.factories', [])
	.factory('CookieFactory', CookieFactory.setup)
	.factory('DOMFactory', DOMFactory.setup)
	.factory('EventListener', EventListener.setup)
	.factory('HttpInterceptor', HttpInterceptor.setup)
	.factory('SessionStorageFactory', SessionStorageFactory.setup)
	.factory('ToolFactory', ToolFactory)
	