import HttpService from './HttpService';


class ShopService extends HttpService {

	constructor($window, $http, AuthService, CONSTANTS) {	
		'ngInject';

		super($http, AuthService, CONSTANTS);
		this.$window = $window;
	}

	
	directToPage(url) {
		return this.$window.open(url);
	}

	shopInfo() {
		return this.get('/shop', true);
	}

	payments() {
		return this.get('/shop/payments');
	}

	/**
	 * Get counties of Taiwan
	 * @access public
	 */
	counties() {
		return this.get('/shop/counties');
	}


	storesByCounty(params) {
		return this.get('/shop/logistics/county', params);
	}


	/**
	 *
	 * params: {type: purchase | product| privacy}
	 */
	statement(params) {
		return this.get('/shop/service/statement', params);
	}	


	/**
	 * Set the status of login modal
	 * @deprecated 
	 * @var boolean
	 */
	set isOpenLoginModal(isOpen) {
		if (Object.prototype.toString.call(isOpen) !== '[object Boolean]') {
			throw new TypeError('Undefined type isOpen.');
		}

		this._isOpenLoginModal = isOpen;
	}	

	/**
	 * @deprecated
	 */
	get isOpenLoginModal() {
		return this._isOpenLoginModal;
	}

}

export default ShopService;