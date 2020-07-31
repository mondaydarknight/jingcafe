
/**
 * Shop Components
 */
import {shopBaseComponent} 			from './components/shop/base/shop-base.component';
import {shopHomeComponent} 			from './components/shop/home/shop-home.component';
import {shopHeaderComponent} 		from './components/shop/header/shop-header.component';
import {shopFooterComponent} 		from './components/shop/footer/shop-footer.component';
import {shopMenubarComponent}		from './components/shop/menubar/shop-menubar.component';
import {shopResendEmailComponent} 	from './components/shop/resend-email/shop-resend-email.component';
import {shopResetPasswordComponent} from './components/shop/reset-password/shop-reset-password.component';
import {shopAboutComponent}			from './components/shop/about/shop-about.component';
import {shopIntroductionComponent} 	from './components/shop/introduction/shop-introduction.component';
import {settlePaymentComponent}		from './components/shop/settle-payment/settle-payment.component';





import {customerCenterComponent}	from './components/shop/customer-center/customer-center.component';



/**
 * Product Components
 */
import {productInterfaceComponent} 	from './components/product/interface/product-interface.component';
import {productOverviewComponent} 	from './components/product/overview/product-overview.component';
import {productDetailComponent} 	from './components/product/detail/product-detail.component';


/**
 * User Components
 */
import {userCartComponent} 					from './components/user/cart/user-cart.component';
import {userCheckoutComponent}				from './components/user/checkout/user-checkout.component';
import {userCheckoutLogisticComponent}		from './components/user/checkout/user-checkout-logistic.component';
import {userCheckoutPaymentComponent}		from './components/user/checkout/user-checkout-payment.component';
import {userCheckoutProductListComponent}	from './components/user/checkout/user-checkout-product-list.component';

import {userMenuDropdownComponent} 			from './components/user/menu-dropdown/user-menu-dropdown.component';
import {userRegisterComponent} 				from './components/user/register/user-regiseter.component';
import {userInterfaceComponent} 			from './components/user/interface/user-interface.component';
import {userSidebarComponent}				from './components/user/sidebar/user-sidebar.component';
import {userMessageNotificationComponent} 	from './components/user/message-notification/user-message-notification.component';
import {userOrderTabsComponent}				from './components/user/order-tabs/user-order-tabs.component';
import {userOrderTimelineComponent} 		from './components/user/order-timeline/user-order-timeline.component';
import {userOrderDetailComponent} 			from './components/user/order-detail/user-order-detail.component';
import {userOrderOverviewComponent} 		from './components/user/order-overview/user-order-overview.component';
import {userInformationComponent} 			from './components/user/information/user-information.component';


/**
 * The components of modal
 */
import {checkoutModalComponent} 		from './components/modal/checkout-modal/checkout-modal.component';
import {loginModalComponent} 			from './components/modal/login-modal/login-modal.component';
import {cancelReasonModalComponent}		from './components/modal/cancel-reason-modal/cancel-reason-modal.component';
import {selectLogisticModalComponent}	from './components/modal/select-logistic-modal/select-logistic-modal.component';





/**
 * UI
 */
import {alertComponent} 				from './components/ui/alert/alert.component';
import {materialSheetComponent} 		from './components/ui/material-sheet/material-sheet.component';
import {orderCanceledComponent}			from './components/ui/order-canceled/order-canceled.component';
import {orderCompletedComponent}		from './components/ui/order-completed/order-completed.component';
import {orderProducedComponent} 		from './components/ui/order-produced/order-produced.component';
import {orderUnpaidComponent}			from './components/ui/order-unpaid/order-unpaid.component';
import {productBillboardComponent}		from './components/ui/product-billboard/product-billboard.component';
import {purchaseProgressComponent}		from './components/ui/purchase-progress/purchase-progress.component';
import {recommendProductComponent}		from './components/ui/recommend-product/recommend-product.component';
import {verificationComponent} 			from './components/ui/verification/verification.component';
import {verificationStepComponent} 		from './components/ui/verification-step/verification-step.component';
import {windowCommercialComponent}		from './components/ui/window-commercial/window-commercial.component';



angular
	.module('jingcafe.components', [])
	.component('shopBase', shopBaseComponent)
	.component('shopHome', shopHomeComponent)
	.component('shopHeader', shopHeaderComponent)
	.component('shopFooter', shopFooterComponent)
	.component('shopMenubar', shopMenubarComponent)
	.component('shopResendEmail', shopResendEmailComponent)
	.component('shopResetPassword', shopResetPasswordComponent)
	.component('shopAbout', shopAboutComponent)
	.component('shopIntroduction', shopIntroductionComponent)

	.component('customerCenter', customerCenterComponent)
	.component('settlePayment', settlePaymentComponent)


	.component('productInterface', productInterfaceComponent)
	.component('productOverview', productOverviewComponent)
	.component('productDetail', productDetailComponent)
	
	.component('userCart', userCartComponent)
	.component('userCheckout', userCheckoutComponent)
	.component('userCheckoutLogistic', userCheckoutLogisticComponent)
	.component('userCheckoutPayment', userCheckoutPaymentComponent)
	.component('userCheckoutProductList', userCheckoutProductListComponent)
	
	// .component('userMessageNotification', userMessageNotificationComponent)
	.component('userMenuDropdown', userMenuDropdownComponent)
	.component('userRegister', userRegisterComponent)
	.component('userInterface', userInterfaceComponent)
	.component('userSidebar', userSidebarComponent)
	.component('userOrderOverview', userOrderOverviewComponent)
	.component('userOrderTabs', userOrderTabsComponent)
	.component('userOrderTimeline', userOrderTimelineComponent)
	.component('userOrderDetail', userOrderDetailComponent)
	.component('userInformation', userInformationComponent)
	

	.component('checkoutModal', checkoutModalComponent)
	.component('loginModal', loginModalComponent)
	.component('cancelReasonModal', cancelReasonModalComponent)
	.component('selectLogisticModal', selectLogisticModalComponent)


	.component('alert', alertComponent)	
	.component('materialSheet', materialSheetComponent)
	.component('orderUnpaid', orderUnpaidComponent)
	.component('orderProduced', orderProducedComponent)
	.component('orderCompleted', orderCompletedComponent)
	.component('orderCanceled', orderCanceledComponent)
	.component('productBillboard', productBillboardComponent)
	.component('purchaseProgress', purchaseProgressComponent)
	.component('recommendProduct', recommendProductComponent)
	.component('verification', verificationComponent)
	.component('verificationStep', verificationStepComponent)
	.component('windowCommercial', windowCommercialComponent)




	