
export default class CookieFactory {

	constructor($cookies, ToolFactory) {
		'ngInject';

		this.$cookies = $cookies;
		this.ToolFactory = ToolFactory;
	}

	set(key, value, expireDay = 1) {
		let cookieExpiration = new Date();

		cookieExpiration.setDate(cookieExpiration.getDate() + expireDay);
		this.$cookies.putObject(key, JSON.stringify(value), { expires: cookieExpiration });
	}	

	remove(key, index) {
		
		if (isNaN(index)) {
			return this.$cookies.remove(key);
		}

		let value = this.get(key);
		
		if (!value || !value.length || !index in value) {
			return;
		} 

		value.splice(index, 1);

		this.set(key, value);
	}


	get(key) {
		return JSON.parse(this.$cookies.getObject(key) || '[]');
	}

	static setup() {
		return new CookieFactory(...arguments);
	}

}

CookieFactory.setup.$inject = ['$cookies', 'ToolFactory'];
