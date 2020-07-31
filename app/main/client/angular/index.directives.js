import {cartProductCancelDirective} 	from './directives/cart-product-cancel';
import {elementDisplayDirective}		from './directives/element-display';
import {inputMatch} 					from './directives/input-match';
import {loaderDirective}				from './directives/loader';
import {orderPaginationDirective}		from './directives/order-pagination';
import {scrollBubbleDirective}			from './directives/scroll-bubble';
import {templateLoaderDirective}		from './directives/template-loader';
import {templateIncludeDirective} 		from './directives/template-include';


angular.module('jingcafe.directives', [])
	.directive('cartProductCancel', cartProductCancelDirective)
	.directive('elementDisplay', elementDisplayDirective)
	.directive('inputMatch', inputMatch)
	.directive('loader', loaderDirective)
	.directive('orderPagination', orderPaginationDirective)
	.directive('templateLoader', templateLoaderDirective)
	.directive('templateInclude', templateIncludeDirective)
	.directive('scrollBubble', scrollBubbleDirective)
	