import {CONSTANTS} from './config/constants';

import extendToastConfig from './config/constants';

import routeApplication from './config/route';


angular
	.module('jingcafe.admin.config', [])
	.constant('CONSTANTS', CONSTANTS)
	.config(extendToastConfig)
	.config(routeApplication)


