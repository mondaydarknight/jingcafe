
export default function ToolFactory() {
	return {
		/**
		 * Determine wether the value is boolean
		 * @return boolean
		 */
		isBoolean: (value) => {
			return value === true || value === false || toString.call(value) === '[object Boolean]';
		},

		/**
		 * Determine whether the value is NaN. It's faster than isNaN()
		 * @return bool 
		 */
		isNaN: (value) => {
			return !(value <= 0) && !(value > 0);
		},

		isString:(value) => {
			return Object.prototype.toString.call(value) === "[object String]";
		},	

		isKeyExists(key, value) {
			if (!value || (value.constructor !== Array && value.constructor !== Object)) {
				return false;
			}

			for (let i=0; i<value.length; i++) {
				if (value[i] === key) {
					return true;
				}
			}

			return key in value;
		},


		getUrlQueryParameters(params) {
			return Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
		},

		/**
		 * Determine whether the key in object
		 * some() or Object.keys()
		 * hasOwnProperty()
		 */
		 isAllKeysInObject(arr, obj) {
		 	for (let key in arr) {
		 		if (!obj.hasOwnProperty(arr[key]))  {
		 			return false;
		 		}
		 	}

		 	return true;
		 },

		debounce: () => {
			let timeout;

			return (func, timeToWait) => {
				clearTimeout(timeout);
				timeout = setTimeout(() => func.apply(this, arguments), timeToWait);
			};
		},

		isValidateError: (CONSTANTS, message) => {
			let symbols = message.split('.');

			return (symbols.length > 1 && (CONSTANTS.hasOwnProperty(symbols[0]) || CONSTANTS.hasOwnProperty(symbols[1])));
		},

		/**
		 * Convert data key to camelCase format
		 * ex: jing_cafe => jingCafe
		 */
		convertToCamelCase: (data) => {
			if (!angular.isObject(data)) {
				return data;
			}

			for (let key in data) {
				let convertKey = key.split('_');

				if (convertKey.length > 1) {
					data[convertKey[0] + convertKey[1].charAt(0).toUpperCase() + convertKey[1].slice(1)] = data[key];
					delete data[key];
				}
			}

			return data;
		},

		consoleError() {
			const args = Array.prototype.slice.call(arguments);
			args.unshift('JingCafe ERROR: ');

			return console.error.apply(console, args);
		},

		TimeController: () => {
			let isFirstClick = true;
			let entryToken;

			return {
				/** 
		 		 * Set throttle for click event of delay 
		 		 * @param 	func 	callback
		 		 * @param 	int 	delay(seconds)
		 		 */
				throttle: (callback, delay, ...args) => {
					
					if (isFirstClick) {
						isFirstClick = false;
						return callback.apply(this, args);
					}

					if (entryToken) {
						return;
					}

					return entryToken = setTimeout(() => {
						clearTimeout(entryToken);
						entryToken = null;
						return callback.apply(this, args);
					}, delay || 500);
				}
			};
		}
	};
}




