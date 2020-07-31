
export default class EventListener {

	constructor($timeout) {
		'ngInject';

		this.$timeout = $timeout;
		this.initEventListenerService();
	}

	/**
	 * Init the listeners and elements.
	 */
	initEventListenerService() {
		this.listeners = {};
		this.elements = [];
	}

	/**
	 * Set event into listener hash
	 * @param string		eventName
	 * @param Function 		event 		callback
	 * @param Prototype 	prototype
	 */
	 on(eventName, event, prototype = this) {
	 	if (!eventName || !event) {
	 		return;
	 	}

	 	let listeners = this.listeners;
	 	let listener = listeners[eventName] || [];

	 	if (listener.indexOf(event) == -1) {
	 		listener.push({event: event, prototype: prototype});
	 	}

	 	this.listeners[eventName] = listener;
	 	return this;
	 }

	/**
	 * Set event in listener hash at one times
	 *
	 * @param string 	eventName 
	 * @param func 	callback
	 */
	 one(eventName, event, prototype = null) {
	 	
	 }

	/**
	 * Delete event of listeners
	 * @param eventName
	 * @param event
	 */
	off(eventName, event) {
		let listener = this.listeners && this.listeners[eventName];

		if (!listener || !listener.length || !event) {
			return;
		}

		let isClearAllEvents = true;

		for (let i=0; i<listener.length; i++) {
			if (listener[i].event === event) {
				isClearAllEvents = false;
				this.listeners[eventName].splice(i, 1);
				break;
			}
		}

		if (isClearAllEvents) {
			delete this.listeners[eventName];
		}
	}

	/**
	 * Execute all events of listener
	 * If the event of listenern need arguments.
	 * there are two ways to eliminate the eventName of first parameter 
	 * 1. Array.prototype.slice.call(arguments, 1);
	 * 2. [].slice.call(arguments, 1);
	 */
	broadcast(eventName) {
		let listener = this.listeners[eventName];

		if (!listener || !listener.length) {
			return;
		}

		let args = Array.prototype.slice.call(arguments, 1) || [];
		
		for (let index in listener) {
			listener[index].event.apply(listener[index].prototype, args);
		}

		return this;
	}

	// timeListener() {
	// 	let isFirstClick = true;
	// 	let entryToken;

	// 	return {
	// 		/** 
	//  		 * Set throttle for click event of delay 
	//  		 * @param 	func 	callback
	//  		 * @param 	int 	delay(seconds)
	//  		 */
	// 		throttle: (callback, delay, ...args) => {
				
	// 			if (isFirstClick) {
	// 				isFirstClick = false;
	// 				return callback.apply(this, args);
	// 			}

	// 			if (entryToken) {
	// 				return;
	// 			}

	// 			return entryToken = this.$timeout(() => {
	// 				clearTimeout(entryToken);
	// 				entryToken = null;
	// 				return callback.apply(this, args);
	// 			}, delay || 500);
	// 		}
	// 	};
	// }

	/**
	 * @property public
	 *
	 * add element 
	 */
	 addElement(element) {
	 	if (!element) {
	 		return;
	 	}

	 	this.elements.push(element);
	 }

	 getElements() {
	 	return this.elements;
	 }

	set listeners(listeners) {
		this._listeners = listeners;
	}

	get listeners() {
		return this._listeners;
	}
 
	set elements(elements) {
		this._elements = elements;		
	}

	get elements() {
		return this._elements;
	}

	static setup() {
		return new EventListener(...arguments);
	}

}

EventListener.setup.$inject = ['$timeout'];


