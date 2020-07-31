import recommendProductTemplate from './recommend-product.template.html';

class RecommendProductController {

	constructor($document, $timeout, ToolFactory) {
		'ngInject';

		this.$document = $document;
		this.$timeout = $timeout;
		this.timeController = ToolFactory.TimeController();
	}

	$onInit() {
		this.recommendProducts = this.parent.recommendProducts;

		this.$timeout(() => {
			this.$content = this.$document[0].body.querySelector('.recommend-product-content');
			this.$contentInner = angular.element(this.$content.querySelector('.recommend-product-content-inner'));
		});
	}

	$postLink() {
		this.isFirstProductItem = true;
		this.isLastProductItem = false;
		this.productConstantWidth = 184;
		this.translateSlideWidth = 0;
	}

	prev($event) {
		$event.preventDefault();

		if (this.isFirstProductItem) {
			return;
		}

		this.timeController.throttle(() => {
			if (!this._isFirstProductItemBeyondContent()) {
				this.isFirstProductItem = true;
				this.isLastProductItem = false;
				return this.$contentInner.css({transform: `translateX(0px)`});
			}

			this.isLastProductItem = false;
			this.translateSlideWidth += this.productConstantWidth;
			this.$contentInner.css({transform: `translateX(${this.translateSlideWidth}px)`});
		},300);
	}

	next($event) {
		$event.preventDefault();

		if (this.isLastProductItem) {
			return;
		}

		this.timeController.throttle(() => {
			const remainingProductWidth = this._calculateRemainingProductWidth();

			if (!this._isLastProductItemBeyondContent(remainingProductWidth)) {
				this.isLastProductItem = true;
				this.isFirstProductItem = false;
				this.translateSlideWidth -= remainingProductWidth;
				return this.$contentInner.css({transform: `translateX(${this.translateSlideWidth}px)`});
			}

			this.isFirstProductItem = false;
			this.translateSlideWidth -= this.productConstantWidth;
			this.$contentInner.css({transform: `translateX(${this.translateSlideWidth}px)`});
		}, 300);

	}

	_isFirstProductItemBeyondContent() {
		return (this.translateSlideWidth + this.productConstantWidth) < 0;
		// return this.$productItems.offset().left + this.cellWidth;
	}

	_isLastProductItemBeyondContent(remainingProductWidth) {
		return remainingProductWidth > this.productConstantWidth;
		// return this.cellTotalWidth + this.productItems.offset().left - this.content.offsetWidth;
	}

	_calculateRemainingProductWidth() {
		return this.$contentInner[0].offsetWidth - this.$content.offsetWidth + this.translateSlideWidth;
	}


}


export const recommendProductComponent = {
	require: {
		parent: '^shopHome'
	},
	template: recommendProductTemplate,
	controller: RecommendProductController,
	controllerAs: '$vm',
	bindings: {}
};

