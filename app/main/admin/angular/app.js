import 'angular-animate';
import 'angular-toastr';
import 'angular-touch';
import 'angular-sanitize';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'angular-xeditable';
import 'angular-cookies';


angular.module('jingcafe.admin', [
	'ui.router',
	'ui.bootstrap',
	'ngSanitize',
	'ngTouch',
	'ngAnimate',
	'toastr',
	'xeditable',
	'ngCookies',

	'jingcafe.admin.run',
	'jingcafe.admin.config',
	'jingcafe.admin.components',
	'jingcafe.admin.directives',
	'jingcafe.admin.factories',
	'jingcafe.admin.services'
	
]);



import "./index.run";

import "./index.config";

import "./index.component";

import "./index.directive";

import "./index.factory";

import "./index.service";

// import "./index.providers";



angular.bootstrap(document, ['jingcafe.admin']);

