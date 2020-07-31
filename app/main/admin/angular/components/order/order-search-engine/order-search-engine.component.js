import orderSearchEngineTemplate from './order-search-engine.template.html';

class OrderSearchEngineController {

	constructor($scope, $document, EventListener) {
		'ngInject';

		this.$scope = $scope;
		this.$document = $document;
		this.EventListener = EventListener;
	}

	$onInit() {
		this.dateTimeSearch = {searchIndex: undefined, methods: [
			{
				dateTimeType: 'today',
				name: '今日'
			}, {
				dateTimeType: 'yesterday',
				name: '昨日'
			}, {
				dateTimeType: 'week',
				name: '過去一周'
			}, {
				dateTimeType: 'month',
				name: '過去一月'
			}
		]};

		this.userSearch = {searchIndex: undefined, methods: [
			{
				userType: 'username',
				name: '會員姓名'
			},
			{
				userType: 'phone',
				name: '電話'
			},
			{
				userType: 'email',
				name: '信箱帳號'
			}
		]};

		this.$searchTypeRadio = this.$document[0].querySelectorAll('input[name="search-type"]');
		this.$searchTags = angular.element(this.$document[0].querySelector('div.search-tags'));

		this._preloadRemoveTagsEvent();
		this.selectDateTimeSearch(0);
		this.$scope.$on('searchOrders', () => this.searchOrders());
	}
 
	$postLink() {

	}

	_preloadRemoveTagsEvent() {
		this.$searchTags.on('click', '[data-role="remove"]', (event, isApply) => {
			angular.element(event.target).parent().remove();
			this.$searchTypeRadio[0].checked = false;
			this.searchInput = this.dateTimeSearch.searchIndex = undefined;
			!isApply && this.$scope.$apply();
		});
	}

	_createTagElement(message) {
		this.$searchTags[0].innerHTML = `<span class="tag label label-success">${message}<span data-role="remove"></span></span>`;
	}


	selectDateTimeSearch(index) {
		if (typeof index !== 'number' || !this.dateTimeSearch.methods[index]) {
			return;
		}

		this.$searchTypeRadio[0].checked = true;
		this.dateTimeSearch.searchIndex = index;
		this.userSearch.searchIndex = undefined;
		this.searchInput = this.dateTimeSearch.methods[index].name;
		this._createTagElement(this.searchInput);
		this.$searchTags.prev().focus().end().closest('.search-group').removeClass('has-error');
	}

	selectUserSearch(index) {
		if (typeof index !== 'number' || !this.userSearch.methods[index]) {
			return;
		}

		this.$searchTypeRadio[1].checked = true;
		this.userSearch.searchIndex = index;
		this.dateTimeSearch.searchIndex = undefined;
		this.$searchTags.find('[data-role="remove"]').trigger('click', true).end().prev().focus().closest('.search-group').removeClass('has-error');
	}

	searchOrders() {
		if (this.dateTimeSearch.searchIndex !== undefined && this.dateTimeSearch.methods[this.dateTimeSearch.searchIndex]) {
			return this.orderOverview.search('dateTime', this.dateTimeSearch.methods[this.dateTimeSearch.searchIndex]);
		}

		if (this.userSearch.searchIndex !== undefined && this.userSearch.methods[this.userSearch.searchIndex]) {
			let searchParams = angular.extend(this.userSearch.methods[this.userSearch.searchIndex], {input: this.searchInput});
			return this.orderOverview.search('user', searchParams);
		}

		return this.$searchTags.closest('.search-group').addClass('has-error');
	}


}


export const orderSearchEngineComponent = {
	require: {
		orderOverview: '^^'
	},
	template: orderSearchEngineTemplate,
	controller: OrderSearchEngineController,
	controllerAs: '$vm',
	bindgins: {}
};
