export default  class NumberService {

	constructor() {
		'ngInject';
	}

	isNormalInteger(value) {
		return /^\+?(0|[1-9])$/.test(value);
	}

	isPositiveNumber(value) {
		const positiveNumber = Math.floor(Number(value));

		return (!isNaN(positiveNumber) && isFinite(positiveNumber)) ? positiveNumber : false;
	}
}