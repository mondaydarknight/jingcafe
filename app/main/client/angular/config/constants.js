
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
	ACCOUNT: {
		EXIST: '帳號已存在',
		DISABLED: '帳號被禁用',
		INVALID: '無效的帳號',
		UNVERIFED: '帳號尚未驗證',
		USER_OR_PASS_INVALID: '帳號或密碼有誤',
		NOT_EXIST: '帳號不存在',
		EXPIRED: '憑證逾時'
	},
	ASSETS: {
		PRODUCT_PATH: 'assets.php?asset=img/products/',
		LOGISTICS_PATH: '/assets/img/logistics/',
		PAYMENTS_PATH: '/assets/img/payments/',
		USER_PATH: '/assets/img/users/'
	},
	ALLOWED_URL: ['/', '/product/list', '/product/detail'],
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
	SCREEN: {
		SIZE_SM: 660
	},
	HTTP: {
		REQUEST_TIMEOUT: 2500
	},
	ORDER:{
		STATUS: {
			W: '尚未付款',
			P: '待出貨',
			C: '完成',
			D: '取消'
		}
	},
	SUCCESS: {
		ADD_PRODUCT: '已加進購物車',
		CANCEL_ORDER: '取消訂單成功',
		CHECKOUT: '訂購成功，請查看信箱',
		LOGIN: '登入成功',
		REGISTER: '註冊成功，請至信箱進行認證',
		SEND_EMAIL: '發送成功，請去信箱確認',
		SETTING: '設定成功',
		UPLOAD: '上傳成功'
	},
	INFO: {
		LOGOUT: '登出成功',
		CANCEL_ORDER: '取消訂單成功'
	},
	WARNING: {
		PRODUCT_NOT_FOUND: '查無商品',
		CART_EMPTY: '購物車為空，請重新訂購商品'
	},
	ERROR: {
		ARRAY: 'The variable is not array type',
		CREDENTIAL: '憑證錯誤',
		NOT_LOGIN: '請先登入會員',
		EMAIL_VERIFY: '請去信箱認證',
		ALREADY_VERIFIED: '已經認證',
		NEED_PRODUCT_QUANTITY: '結帳至少需要一件商品',
		NUMBER: 'The variable is not number type',
		OBJECT: 'The variable is not obejct type',
		PRODUCT_QUANTITY: '訂購數量有誤',
		PURCHASE_ERROR: '無法訂購商品',
		RESPONSE_STATUS: 'Response status was unknown',
		STRING: 'The variable is not string type',
		SYSTEM_BUSY: '系統忙碌中，請稍後',
		UNKNOWN: '未知錯誤',
		URL_NOT_FOUND: '找不到網址',
		USER_ALREADY_EXIST: '已經加入會員',
		OCCUR: '發生錯誤'
	},
	VALIDATE: {
		// INVALID_EMAIL: '信箱格式有誤',
		NO_LEAD_WS: '輸入不能有空白',
		INVALID_USERNAME: '姓名長度需大於2',
		INVALID_EMAIL: '信箱帳號有誤',
		INVALID_PASSWORD: '密碼長度需大於5',
		INVALID_LENGTH: '輸入長度有誤',
		INVALID_PHONE: '無效的電話號碼',
		INVALID_INTEGER: '無效的數值',
		INVALID_STRING: '無效的字串'
	},
	URL: {
		LOCAL: {
			ADMIN: '/admin',
			LOGISTIC: '/select-logistic'
		}
	}
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


