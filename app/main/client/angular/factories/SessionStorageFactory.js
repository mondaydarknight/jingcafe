
export default class SessionStorageFactory {

	constructor($q) {
		'ngInject';

		this.$q = $q;
	}

	/**
	 * Set key|value in sessionStorage
	 * @param string 	key
	 * @param mixed 	value
	 */
	_saveSessionStorage(key, value) {
		sessionStorage.setItem(key, JSON.stringify(value));
	}

	/**
	 * Get value from sessionStorage
	 * @param key
	 * @return mixed
	 */			 
	_getSessionStorage(key) {
		return JSON.parse(sessionStorage.getItem(key) || '[]');
	}

	_removeSessionStorage(key) {
		return sessionStorage.removeItem(key);
	}

	/**
	 * Clear sessionStorage.
	 */
	_clearSessionStorage() {
		return sessionStorage.clear();
	}


	put(key, value) {
		const deferred = this.$q.defer();

		this._saveSessionStorage(key, value);
		deferred.resolve(value);

		return deferred.promise;
	}

	push(key, value) {
		const deferred = this.$q.defer();

		this._getSessionStorage(key).then((items) => {
			items.push(value);
			deferred.resolve(this._saveSessionStorage(key, items));
		});

		return deferred.promise;
	}

	get(key) {
		const deferred = this.$q.defer();

		deferred.resolve(this._getSessionStorage(key));

		return deferred.promise;
	}

	/**
	 * Remove the item of sessionStorage
	 * @param int 	key
	 * @param index the index of items
	 */
	remove(key, index = null) {
		let items = this._getSessionStorage(key);
		
		if (!items || !items.length) {
			return;
		}
		
		if (!index || items.indexOf(index) == -1) {
			return this._removeSessionStorage(key);
		}

		items.splice(index, 1);
		return this._saveSessionStorage(key, items);
	}

	clear() {
		this._clearSessionStorage();
		return true;;
	}


	static setup() {
		return new SessionStorageFactory(...arguments);
	}

}

SessionStorageFactory.setup.$inject = ['$q'];
