import productBillboardTemplate from './product-billboard.template.html';

class ProductBillboardController {

	constructor($document, $timeout) {
		'ngInject';

		this.$document = $document;
		this.$timeout = $timeout;
	}

	$onInit() {
		this.slideWidth = 0;
		this.arrowElements = this.$document[0].body.querySelectorAll('.product-billboard-arrow');
		this.billboardView = this.$document[0].body.querySelector('.product-billboard-view');
		this.billboardViewInner = this.$document[0].body.querySelector('.product-billboard-view-wrap');
	}

	prev() {
		const productItems = this.billboardView.querySelectorAll('.product-billboard-item');
		const _calculateCurrentSteps = () => Math.ceil(Math.abs(this.slideWidth) / productItems[0].offsetWidth);
		const currentStep = _calculateCurrentSteps();



		if (currentStep <= 0) {
			return;
		}

		if (currentStep === 1) {
			this.arrowElements[0].classList.remove('active');
		}

		this.arrowElements[1].classList.add('active');
		this.slideWidth += productItems[0].offsetWidth;
		this.slideBillboard();
	}

	next() {
		const productItems = this.billboardViewInner.querySelectorAll('.product-billboard-item');
		const _calculateCurrentSteps = () => Math.ceil((this.billboardViewInner.offsetWidth - this.billboardView.offsetWidth + this.slideWidth) / productItems[0].offsetWidth);
		const currentStep = _calculateCurrentSteps();
		
		if (currentStep <= 0) {
			return;
		}

		if (currentStep === 1 ) {
			this.arrowElements[1].classList.remove('active');			
		}

		this.arrowElements[0].classList.add('active');
		this.slideWidth -= productItems[0].offsetWidth;
		this.slideBillboard();
	}

	slideBillboard() {
		this.billboardViewInner.style.transform = `translateX(${this.slideWidth}px)`;		
	}

}


function getComputedTranslateXY(obj) {
	const transArr = [];
	
    if(!window.getComputedStyle) {
    	return;	
    } 

    const style = getComputedStyle(obj);
    const transform = style.transform || style.webkitTransform || style.mozTransform;
    
    let mat = transform.match(/^matrix3d\((.+)\)$/);    
    
    if(mat) {
    	return parseFloat(mat[1].split(', ')[13]);
    }

    mat = transform.match(/^matrix\((.+)\)$/);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : 0;
    mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : 0;
    
    return transArr;
}

export const productBillboardComponent = {
	template: productBillboardTemplate,
	controller: ProductBillboardController,
	controllerAs: '$vm',
	bindings: {
		recommendProducts: '<'
	}
};