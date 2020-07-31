export default class AppModel {
	construct($rootScope) {
		this.Model = {};
	}

	set(key = '', value) {
		return !!Model[key];		
	}

	is() {
		return !!this.Model[key];
	} 

	get() {
		return this.Model[key];
	}

	dispatch(key,  value) {
		return $rootScope.$emit('AppModel', {key, value});
	}

	store(key, value = '') {
		this.Model[key] = value;
	}	
 
}