


export default class SidebarService {

	constructor($state, CONSTANTS) {
		'ngInject';

		this.$state = $state;
		this.CONSTANTS = CONSTANTS;
		this.isMenuCollapsed = this.isCurrentMenuCollapsed();
	}

	getStaticMenuItems() {	
		let staticMenuItems = [];
		this.$state.get().filter((state) => state.sidebarMeta).forEach((state) => {
			let staticMenuItem = {
				icon: state.sidebarMeta.icon,
				title: state.sidebarMeta.title,
				href: state.name
			};

			if (state.sidebarMeta.mainList) {
				staticMenuItem.subMenuItems = [];
				staticMenuItems.push(staticMenuItem);
			} else {
				for (let i=0; i<staticMenuItems.length; i++) {
					if (staticMenuItem.href.indexOf(staticMenuItems[i].href) > -1) {
						staticMenuItems[i].subMenuItems.push(staticMenuItem);
						break;
					}
				}
			}
		});

		return this.staticMenuItems = staticMenuItems;
	}

	isCurrentMenuCollapsed() {
		return window.innerWidth <= this.CONSTANTS.LAYOUT.SIDEBAR_COLLAPSED_WIDTH;
	}

	isCurrentMenuHidden() {
		console.log(this.CONSTANTS.LAYOUT.SIDEBAR_HIDE_WIDTH);
		return window.innerWidth <= this.CONSTANTS.LAYOUT.SIDEBAR_HIDE_WIDTH; 
	}

	toggleMenuCollapsed() {
		this.isMenuCollapsed = !this.isMenuCollapsed;
	}


	set staticMenuItems(staticMenuItems) {
		this._staticMenuItems = staticMenuItems;
	}

	/**
	 * @return array|undefined
	 */
	get staticMenuItems() {
		return this._staticMenuItems || this.getStaticMenuItems();
	}

	set isMenuCollapsed(isMenuCollapsed) {
		this._isMenuCollapsed = isMenuCollapsed;
	}

	get isMenuCollapsed() {
		return this._isMenuCollapsed;
	}

}

