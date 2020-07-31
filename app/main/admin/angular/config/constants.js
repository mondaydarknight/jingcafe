
export const CONSTANTS = {
	ACCOUNT: {
		EXIST: 		'帳號已存在',
		DISABLED: 	'帳號被禁用',
		INVALID: 	'無效的帳號',
		UNVERIFED: 	'帳號尚未驗證',
		USER_OR_PASS_INVALID: '帳號或密碼有誤'
	},
	ALERT: {
		SUCCESS: {
			CLASS: 'alert-success',
			ICON: 'fa fa-check-circle'
		},
		INFO: {
			CLASS: 'alert-info',
			ICON: 'fa fa-check-triangle'
		},
		WARNING: {
			CLASS: 'alert-warning',
			ICON: 'fa fa-exclamation-triangle'
		},
		DANGER: {
			CLASS: 'alert-danger',
			ICON: 'fa fa-exclamation-circle'
		}
	},
	ASSETS: {
		PRODUCT_PATH: 'assets.php?asset=img/products/',
		LOGISTICS_PATH: '/assets/img/logistics/',
		PAYMENTS_PATH: '/assets/img/payments/',
		USER_PATH: '/assets/img/users/'
	},
	FILE: {
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
	LAYOUT: {
		SIDEBAR_COLLAPSED_WIDTH: 1200,
		SIDEBAR_HIDE_WIDTH: 500
	},

	HTTP: {
		REQUEST_TIMEOUT: 2500
	},
	ORDER:{
		SETTING: {
			unpaid: `<div class="setting-item"><button class="btn btn-default" ng-disabled="!$vm.settingCollection.length" ng-click="$vm.alterOrder('produced')">完成付款</button></div>\
					<div class="setting-item"><button class="btn btn-warning" ng-disabled="!$vm.settingCollection.length" ng-click="$vm.alterOrder('canceled')">取消訂單</button></div>`,
			produced: `<div class="setting-item"><button class="btn btn-default" ng-disabled="!$vm.settingCollection.length" ng-click="$vm.alterOrder('unpaid')">尚未付款</button></div>
			<div class="setting-item"><button class="btn btn-info" ng-disabled="!$vm.settingCollection.length" ng-click="$vm.alterOrder('completed')">完成出貨</button></div>`
		},
		STATUS: {
			W: '尚未付款',
			P: '待出貨',
			C: '完成',
			D: '取消'
		}
	},
	SUCCESS: {
		ALTER: '修改成功',
		UPLOAD: '上傳成功',
		LOGIN: '登入成功'
	},
	INFO: {
		DELETE: '刪除成功',
		LOGOUT: '登出成功',
		UPDATE: '訂單更新成功'
	},
	WARNING: {

	},
	ERROR: {
		UNKNOWN: '未知錯誤',
		NOT_LOGIN: '尚未登入'
	},
	VALIDATE: {
		NO_LEAD_WS: 		'輸入不能有空白',
		INVALID_USERNAME: 	'姓名長度需大於2',
		INVALID_EMAIL: 		'信箱帳號有誤',
		INVALID_PASSWORD: 	'密碼長度需大於5',
		INVALID_LENGTH: 	'輸入長度有誤',
		INVALID_PHONE: 		'無效的電話號碼',
		INVALID_INTEGER: 	'無效的數值',
		INVALID_STRING: 	'無效的字串'
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