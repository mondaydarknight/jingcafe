

export default function EventListener() {
	let listeners = {};

	/**
	 * Array delete() vs splice()
	 * We use splice() operator instead of delete() operator
	 * Because after delete(), the prototype value is overwritten, but memory is not reallocated.
	 * Using delete() on array will polluate lead to causing bugs. 
	 */


	return {

		/**
		 * Preload event into EventListener
		 * @return EventListener
		 */
		on(eventName, callback, prototype = this) {
			if (!eventName || !callback) {
				return;
			}

			let listener = listeners[eventName] || [];
			let event = {prototype: prototype, callback: callback};

			if (listener.indexOf(event) == -1) {
				listener.push(event);
			}

			listeners[eventName] = listener;
			return this;
		},

		/**
		 * Delete all event from same listener 
		 * Using operator delete is unexpectedly slow
		 * Delete is the only true way to remove object's properties without any leftovers
		 * If you're usgin delete in loops anad you have problems with performance
		 * @return EventListener
		 */
		off(eventName) {
			listeners[eventName] = listeners[eventName] && undefined;
			return this;
		},

		/**
		 * Trigger all of the events by same eventName
		 * arguments: eventName, Prototype(Class), argument1, argument2...
		 * @return EventListener
		 */
		broadcast(eventName) {
			let listener = listeners[eventName];

			if (!listener || !listener.length) {
				return;
			}

			let args = Array.prototype.slice.call(arguments, 1);

			for (let event in listener) {
				listener[event].callback.apply(listener[event].prototype, args);
			}

			return this;
		}
	};
}

