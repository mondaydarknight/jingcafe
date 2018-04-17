
export const CONSTANTS = {
	ALERT: {
		success: {
			class: 'alert-success',
			icon: 'fa fa-check-circle'
		},
		info: {
			class: 'alert-info',
			icon: 'fa fa-check-triangle'
		},
		warning: {
			class: 'alert-warning',
			icon: 'fa fa-exclamation-triangle'
		},
		danger: {
			class: 'alert-danger',
			icon: 'fa fa-exclamation-circle'
		}
	},
	FILES: {
		NO_FILE: '請上傳檔案',
		STYLE: {
			position: "absolute",
			"z-index": '-9999',
			height: 0,
			width: 0,
			padding: 0,
			margin: 0,
			'line-height': 0,
			outline: 0,
			border: 0,
			opacity: 0 
		}
	},
	HTTP: {
		REQUEST_TIMEOUT: 2500
	},
	SUCCESS: {
		LOGIN: '登入成功',
		REGISTER: '註冊成功',
		SEND_ORDER: '訂購成功，請至訂單管理查看',
		CANCEL_ORDER: '取消訂單成功'
	},
	INFO: {

	},
	WARNING: {
		PRODUCT_NOT_FOUND: '查無商品',
		CART_EMPTY: '購物車為空，請重新訂購商品'
	},
	ERROR: {
		NUMBER: 'The variable is not number type',
		STRING: 'The variable is not string type',
		ARRAY: 'The variable is not array type',
		OBJECT: 'The variabel is not obejct type',
		NOT_LOGIN: '請先登入會員',
		PRODUCT_QUANTITY: '訂購數量有誤',
		NEED_PRODUCT_QUANTITY: '請訂購商品',
		UNKNOWN: '未知錯誤',
		URL_NOT_FOUND: '找不到網址'
	},
};


export default function extendToastConfig(toastrConfig) {
	angular.extend(toastrConfig, {
		closeButton: true,
		closeHtml: '<button>&times;</button>',
		timeOut: 5000,
		autoDismiss: false,
		containerId: 'toast-container',
		maxOpened: 0,
		newsOnTop: true,
		positionClass: 'toast-top-right',
		preventDuplicates: false,
		preventOpenDuplicates: false,
		target: 'body'
	});
}


