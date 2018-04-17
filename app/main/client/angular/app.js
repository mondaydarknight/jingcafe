import 'angular-animate';
import 'angular-toastr';
import 'angular-touch';
import 'angular-sanitize';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'angular-xeditable';

angular.module('jingcafe', [
	'ui.bootstrap',
	'ui.router',
	'ngSanitize',
	'ngTouch',
	'ngAnimate',
	'toastr',
	'xeditable',
	// 'ngCookies',

	'jingcafe.run',
	'jingcafe.config',
	'jingcafe.components',
	// 'jingcafe.filters',
	// 'jingcafe.directives',
	'jingcafe.services',
	'jingcafe.factories',
	// 'jingcafe.providers',
	// 'jingcafe.controllers',
	
]);



import "./index.run";

import "./index.config";


import "./index.component";


// import "./index.filters";

import "./index.directives";

import "./index.factory";

import "./index.services";

// import "./index.providers";



angular.bootstrap(document, ['jingcafe']);

