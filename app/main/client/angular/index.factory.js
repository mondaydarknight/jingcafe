import Authentication from './factories/Authentication';


angular
	.module('jingcafe.factories', [])
	.factory('Authentication', Authentication.setup)
	