import settingTemplate from './setting.template.html';


class SettingController {

	constructor($state, EventListener, ShopService, toastr, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.EventListener = EventListener;
		this.ShopService = ShopService;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.EventListener.broadcast('isLoaderActive', false);

	}

	update() {
		this.EventListener.broadcast('isLoaderActive', true);

		return this.ShopService.update(this.adminLayout.shop).then((response) => {
			this.toastr.success(this.CONSTANTS.SUCCESS.ALTER);
		}, (error) => {
			this.toastr.error(this.CONSTANT.UNKNOWN);
		})
		.finally(() => this.EventListener.broadcast('isLoaderActive', false));
	}

}

export const settingComponent = {
	require: {
		adminLayout: '^'		
	},
	template: settingTemplate,
	controller: SettingController,
	controllerAs: '$vm',
	bindings: {}
};
