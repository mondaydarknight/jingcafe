import 'angular-animate';
import 'angular-toastr';
import 'angular-touch';
import 'angular-sanitize';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'angular-xeditable';
import 'angular-cookies';

import "jquery.fancybox/source/jquery.fancybox.css";
import "jquery.fancybox/source/jquery.fancybox";

angular.module('jingcafe', [
	'ui.router',
	'ui.bootstrap',
	'ngSanitize',
	'ngTouch',
	'ngAnimate',
	'toastr',
	'xeditable',
	'ngCookies',

	'jingcafe.run',
	'jingcafe.config',
	'jingcafe.components',
	// 'jingcafe.filters',
	'jingcafe.directives',
	'jingcafe.factories',
	'jingcafe.services'
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

