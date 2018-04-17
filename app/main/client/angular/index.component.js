
import {shopBaseComponent} from './components/shop-base/shop-base.component';

import {shopHomeComponent} from './components/shop-home/shop-home.component';
import {shopHeaderComponent} from './components/shop-header/shop-header.component';
import {shopFooterComponent} from './components/shop-footer/shop-footer.component';
import {shopMenuComponent} from './components/shop-menu/shop-menu.component';

import {productInterfaceComponent} from './components/product-interface/product-interface.component';
import {productOverviewComponent} from './components/product-overview/product-overview.component';
// import {orderCancelComponent} from './components/order-cancel/order-cancel.component';


angular
	.module('jingcafe.components', [])
	.component('shopBase', shopBaseComponent)
	.component('shopHome', shopHomeComponent)
	.component('shopHeader', shopHeaderComponent)
	.component('shopFooter', shopFooterComponent)
	.component('shopMenu', shopMenuComponent)
	.component('productInterface', productInterfaceComponent)
	.component('productOverview', productOverviewComponent)

	// .component('orderCancel', orderCancelComponent)