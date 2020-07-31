

class ScrollService {

	constructor() {
		'ngInject';
	}

	scrollTopLinear(speed) {
		const scrollStep = -window.scrollY / (speed / 15);
		
		let scrollInterval = setInterval(() => {
			window.scrollY !== 0 ? window.scrollBy(0, scrollStep) : clearInterval(scrollInterval);
		},  15);
	}


	/**
	 *  - pi is the length/end point of the cosinus intervall (see above)
	 *  - newTimestamp indicates the current time when callbacks queued by requestAnimationFrame begin to fire.
     *  (for more information see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
	 *	* - newTimestamp - oldTimestamp equals the duration
     *  a * cos (bx + c) + d               	        | c translates along the x axis = 0
     *	= a * cos (bx) + d                          | d translates along the y axis = 1 -> only positive y values
     *  = a * cos (bx) + 1                          | a stretches along the y axis = cosParameter = window.scrollY / 2
     *  = cosParameter + cosParameter * (cos bx)    | b stretches along the x axis = scrollCount = Math.PI / (scrollDuration / (newTimestamp - oldTimestamp))
     *  = cosParameter + cosParameter * (cos scrollCount * x)
	 */
	scrollTopEaseInOut(speed) {
		const scrollHeight = window.scrollY;
		const scrollStep = Math.PI / (speed / 15);
		const cosParameter = scrollHeight / 2;

		let scrollCount = 0;
		let scrollMargin;
		let scrollInterval = setInterval(() => {
			if (window.scrollY !== 0) {
				scrollCount++;
				scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
			} else {
				clearInterval(scrollInterval);
			}
		}, 15);


		// Version 2
		// const cosParameter = window.scrollY / 2;
		// const oldTimestamp = Date.now();
		// let scrollCount = 0;

		// const step = (newTimestamp) => {
		// 	scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));

		// 	if (scrollCount > = Math.PI) {
		// 		window.scrollTo(0, 0);
		// 	} 

		// 	if (window.scrollY === 0) {
		// 		return;
		// 	}

		// 	window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
		// 	window.requestAnimationFrame(step);
		// };


		// window.requestAnimationFrame(step);
	}

	scrollTopGeneral(speed) {
		const stepTime = 20;
		const topOffset = document.body.scrollTop || document.documentElement.scrollTop;
		let stepAmount = topOffset;
		const scrollAnimation = (topOffset, stepAmount) => {
			let position = topOffset - stepAmount > 0 ? topOffset - stepAmount : 0;

			document.body.scrollTop = document.documentElement.scrollTop = position;

			position && setTimeout(() => scrollAnimation(position, stepAmount), stepTime);
		};

		speed && (stepAmount = (topOffset * stepTime) / speed);
		scrollAnimation(topOffset, stepAmount);
	}

}	


export default ScrollService;