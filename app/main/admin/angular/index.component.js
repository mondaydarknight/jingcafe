
import {adminHeaderComponent} 			from './components/header/admin-header.component';
import {adminLayoutComponent} 			from './components/layout/admin-layout.component';
import {adminLobbyComponent} 			from './components/lobby/admin-lobby.component';
import {adminSidebarComponent} 			from './components/sidebar/admin-sidebar.component';
import {adminLoginComponent}			from './components/login/admin-login.component';


import {fileComponent} 					from './components/ui/file/file.component';
import {notificationMessageComponent} 	from './components/ui/notification-message/notification-message.component';

import {orderOverviewComponent} 		from './components/order/order-overview/order-overview.component';
import {orderSearchEngineComponent} 	from './components/order/order-search-engine/order-search-engine.component';
import {orderTabsComponent}				from './components/order/order-tabs/order-tabs.component';
import {orderComponent}					from './components/order/order/order.component';



import {productOverviewComponent}		from './components/product/product-overview/product-overview.component';
import {productUploadComponent} 		from './components/product/product-upload/product-upload.component';


import {settingComponent}				from './components/setting/setting.component';


/** Modal components */ 
import {productUploadModalComponent} 	from './components/modal/product-upload/product-upload-modal.component'; 
import {alterOrderModalComponent}		from './components/modal/alter-order/alter-order-modal.component';
import {removeProductModalComponent}	from './components/modal/remove-product/remove-product-modal.component';



/** User components **/
import {userListComponent}				from './components/user/list/user-list.component';



angular.module('jingcafe.admin.components', [])
	.component('adminHeader', adminHeaderComponent)
	.component('adminLayout', adminLayoutComponent)
	.component('adminLobby', adminLobbyComponent)
	.component('adminSidebar', adminSidebarComponent)
	.component('adminLogin', adminLoginComponent)


	.component('file', fileComponent)
	.component('notificationMessage', notificationMessageComponent)
	
	.component('orderOverview', orderOverviewComponent)
	.component('orderSearchEngine', orderSearchEngineComponent)
	.component('orderTabs', orderTabsComponent)
	.component('order', orderComponent)

	.component('productOverview', productOverviewComponent)
	.component('productUpload', productUploadComponent)

	.component('setting', settingComponent)

	.component('productUploadModal', productUploadModalComponent)
	.component('alterOrderModal', alterOrderModalComponent)
	.component('removeProductModal', removeProductModalComponent)

	.component('userList', userListComponent)











