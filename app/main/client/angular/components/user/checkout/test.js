/**
	 *
	 * @access private
	 */
	_checkoutHandler() {
		const parser = new DOMParser();
		let isRenderUserInfo = false;
		let productTotalPrice = 0;
		let countyStoreItemsCache = {};

		const getStoreItemsByCurrentCounty = () => {
			let countyId = this.checkoutParams.logistic.county && this.checkoutParams.logistic.county.id;
				
			if (!this.checkoutHandler.hasStoreItems(countyId)) {
				throw new Error('Undefined county in logistic store cache.');
			}
					
			return countyStoreItemsCache[countyId];
		};

		return {
			/**
			 * Show the error notify in input text
			 * @param string selector
			 */
			addErrorInFormSelector: (selectorName) => {
				const $selector = angular.element(this.$document[0].body.querySelector(`input[name="${selectorName}"]`));
				
				const $selectorFormGroup = $selector.focus().closest('div.form-group');
				$selectorFormGroup.addClass('has-error').on('keyup', () => {
					$selectorFormGroup.removeClass('has-error').off('keyup');
				});

				if (this.checkoutParams.user.hasOwnProperty(selectorName)) {
				}
			},
			
			removeCheckoutProducts: (index, isCartRefresh = false) => {
				if (this.products[index] !== undefined) {
			 		angular.element(this.$document[0].body.querySelectorAll('div.order-content-item')).eq(index).fadeOut(1000);
			 		this.products.splice(index, 1);
			 		
			 		if (!isCartRefresh) {
			 			this.$rootScope.$broadcast('refreshUserCart', this.products);	
			 		}
			 	}
			},
			
			toggleRenderUserInfo: () => {
				this.$userInfoCheckbox.checked = isRenderUserInfo = !isRenderUserInfo;	

				if (isRenderUserInfo) {
					return angular.extend(this.checkoutParams.user, this.user);	
				}
				
				this.checkoutParams.user = {};
			},
			
			getTotalPrice: () => {
				this.products.forEach((product) => productTotalPrice += product.totalPrice);
				return productTotalPrice;
			},
		
			hasStoreItems: (countyId) => {
				return typeof countyStoreItemsCache[countyId] !== 'undefined';
			},

			extractStoreItemsFromRemoteServer: (textHtml) => {
				let countyId = this.checkoutParams.logistic.county.id;
				let htmlDocument = parser.parseFromString(textHtml, 'text/html');
				let storeItems = htmlDocument.querySelectorAll('tr');

				countyStoreItemsCache[countyId] = [];

				for (let i=1; i<storeItems.length; i++) {
					countyStoreItemsCache[countyId].push({
						id: storeItems[i].children[0].textContent,
						shop: storeItems[i].children[1].textContent,
						address: storeItems[i].children[2].textContent
					});
				}

				return this.checkoutHandler;
			},

			/**
			 * Filter the items of store by address for callback method
			 */
			filterStoreItemsByAddress: (event) => {
				let searchKeyword = event.target.value;

				if (!searchKeyword || searchKeyword == '') {
					return this.checkoutHandler.renderStoreListView();
				} 

				let storeItems = getStoreItemsByCurrentCounty()
					.filter((storeItem) => storeItem.address.indexOf(searchKeyword) > -1);

				if (!storeItems || !storeItems.length) {
					return this.$storeListView.find('tbody')[0].innerHTML = '<tr><td colspan="3" class="text-box" style="text-align: center;">查無資料</td></tr>';
				}

				this.checkoutHandler.renderStoreListView(storeItems);
			},

			/** 
			 * Opt JavaScript API documentFragment for iterating data, it's a real booster than jQuery.append()
			 * @note we directly use DocumentFragment and native DOM methods are more optimal than using jQeury.append().
			 * Event delegation is typically more performant than binding each individually.
			 */
			renderStoreListView: (storeItems) => {
				if (!storeItems || !storeItems.length) {
					storeItems = getStoreItemsByCurrentCounty();
				}
				
				const storeTbody = this.$storeListView.find('tbody')[0];
				let trFragment = document.createDocumentFragment();
				let tdFragment = document.createDocumentFragment();

				for (let i=0; i<storeItems.length; i++) {
					for (let key in storeItems[i]) {
						let tdElement = document.createElement('td');

						tdElement.appendChild(document.createTextNode(storeItems[i][key]));
						tdFragment.appendChild(tdElement);
					}

					let trElement = document.createElement('tr');

					trElement.appendChild(tdFragment);
					trFragment.appendChild(trElement);
				}

				storeTbody.innerHTML = "";
				storeTbody.appendChild(trFragment);
			}
		};
	}
