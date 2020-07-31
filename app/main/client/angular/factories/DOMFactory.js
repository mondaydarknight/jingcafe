
class DOMFactory {


	constructor() {

	}

	closest(element, selector) {
		var matchesFn;

	    // find vendor prefix
	    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
	        if (typeof document.body[fn] == 'function') {
	            matchesFn = fn;
	            return true;
	        }
	        return false;
	    })

	    if (selector.charAt(0) === '.' && element.className.indexOf(selector.slice(1)) > -1) {
	    	return element;
	    }
	    
	    var parent;
	    // traverse parents
	    while (element) {
	        parent = element.parentElement;
	        // console.log(parent);
	        if (parent && parent[matchesFn](selector)) {
	            return parent;
	        }
	        element = parent;
	    }

	    return null;
	}

	
	// closest(element, selector, stopSelector) {
	// 	let realElement = null;

	// 	while (element) {
	// 		if (element.className.indexOf(selector) > -1) {
	// 			realElement = element;
	// 			break;
	// 		} else if (stopSelector && element.className.indexOf(stopSelector) > -1) {
	// 			break;
	// 		}

	// 		element = element.parentElement;
	// 	}

	// 	return realElement;
	// }

	// closest(elemnt, selector, stopSelector) {
	// 	if (!element || !element.parentElement) return null;
	// 	else if (stopSelector && element.parentElement.matches(stopSelector)) return null;
	// 	else if (element.parentElement.matches(selector)) return element.parentElement;
	// 	else return this.closest(element.parentElement, selector);
	// }

	static setup() {
		return new DOMFactory(...arguments);
	}

}

export default DOMFactory;
