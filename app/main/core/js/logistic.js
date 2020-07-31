import fetch from 'node-fetch';


var Logistic = (function() {

	var URL = {
		DOMAIN: '/',
		SERVER: {
			COUNTIES: '/shop/counties',
			STORES: '/shop/logistics'
		},
		REMOTE: {
			COUNTIES: 'https://cdngarenanow-a.akamaihd.net/shopee/shopee-pcmall-live-tw/assets/7.bundle.c1f64d7f9e9a3b864ce1.js',
			DISTRICTS: 'https://cdngarenanow-a.akamaihd.net/shopee/shopee-pcmall-live-tw/assets/6.bundle.7a1e886293547d58619b.js'
		}
	};

	var FetchRequest = (function() {

		function FetchRequest() {}

		var request = function(params) {
			var method = params.method || 'GET';
			var queryParameters = '';
			var body;
			var headers = params.headers || {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			};

			if (['GET', 'DELETE'].indexOf(method) > -1) {
				queryParameters = '?' + FetchRequest.getQueryUrlParameters(params.data);
			} else {
				body = JSON.stringify(params.data);
			}

			var url = params.url + queryParameters;

			return fetch(url, {method, headers, body});
		};

		FetchRequest.getQueryUrlParameters = function(params) {
			return Object.keys(params).map(function(key) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
			}).join('&');

		};

		FetchRequest.get = function(params) {
			return request(Object.assign({method: 'GET'}, params));
		};

		FetchRequest.post = function(params) {
			return request(Object.assign({method: 'POST'}, params));
		};

		FetchRequest.put = function(params) {
			return request(Object.assign({method: 'PUT'}, params));
		};

		FetchRequest.delete = function(params) {
			return request(Object.assign({method: 'DELETE'}, params));
		};

		FetchRequest.jsonp = function(params) {
			if (!params.url) {
				throw new TypeError('Undefined or empty url.')
			}

			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			
			script.type = 'text/javascript';
			script.charset = 'utf-8';
			script.async = true;
			script.src = params.url;

			head.appendChild(script);
		};

		return FetchRequest;
	}());

	FetchRequest.callSuccessResponse = function(response) {
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return response.json();
	};

	FetchRequest.callErrorResponse = function(error) {
		throw new Error(error.statusText);
	};

	function defer() {
		var resolve;
		var reject;
		var promise = new Promise(function(a, b) {
			resolve = a;
			reject = b;
		});
		
		return {
			resolve: resolve,
			reject: reject,
			promise: promise
		};
	}

	/**
	 * Components 
	 */
	 function Loader() {
		var TYPE = {
			bounced: {
				template: 
					`<div class="loader-container">
						<span class="bounced-item"></span>
						<span class="bounced-item"></span>
						<span class="bounced-item"></span>
					</div>`
			}, 
			dashed: {
				template: ''
			}
		}; 

	 	var init = function() {
			this.loader = document.querySelector('[loader]');
			var loaderType = this.loader.getAttribute('loader');

			if (!loaderType || !TYPE[loaderType]) {
				throw new Error('Unknown or empty of loader attribute');
			}

			this.loader.setAttribute('data-text', "");
			this.loader.setAttribute('data-blink', '');
			this.loader.classList = 'loader loader-' + loaderType;
			this.loader.innerHTML = TYPE[loaderType].template;
	 	}.bind(this);

	 	this.active = function(isActive = true) {
	 		isActive ? this.loader.classList.add('active') : this.loader.classList.remove('active');
	 	};

	 	init();
	 }

	 // Tabs component
	 function TabsComponent(store) {
	 	this.store = store;
	 	this.scopebarMenu = document.querySelector('.search-scopebar-menu');	 		
	 	this.tabs = [];

	 	this.init();

		this.selectTab(0);
	 }

	 TabsComponent.prototype = {
	 	init() {
	 		if (!this.store.components || !this.store.components.length) {
	 			throw new Error('No component to initiate.');
	 		}

	 		this.render();
	 	},

	 	render() {
	 		for (var i=0; i<this.store.components.length; i++) {
	 			if (Object.prototype.toString.call(this.store.components[i]) !== '[object Function]') {
	 				throw new TypeError('Undefined or empty Object in components.');
	 			}

	 			new this.store.components[i](this);
	 		}
	 	},

	 	selectTab(index) {
	 		var scopebarItems = this.scopebarMenu.querySelectorAll('.scopebar-item');

	 		if (!this.tabs[index]) {
	 			throw new Error('Undefined index in tabs.');
	 		}

	 		for (var i=0; i<this.tabs.length; i++) {
	 			this.tabs[i].select(false);
	 			scopebarItems[i].classList.remove('active');
	 		}

	 		this.tabs[index].select(true);
	 		scopebarItems[index].classList.add('active');
	 	},

	 	/**
	 	 * Add tab view
	 	 * @access private
	 	 */
	 	addTab(tab) {
	 		this.tabs.push(tab);
	 		this.appendTabView();
	 	},

	 	/**
	 	 * Append to tab
	 	 * @access private
	 	 */ 
	 	appendTabView() {
	 		var fragment = document.createDocumentFragment();
	 		var tabView = document.createElement('li');
	 		
	 		tabView.setAttribute('class', 'scopebar-item');
	 		tabView.innerHTML = '<a href class="item-link" onclick="event.preventDefault();">' + this.tabs[this.tabs.length - 1].title() + '</a>';
	 		fragment.appendChild(tabView);
	 		this.scopebarMenu.appendChild(fragment);
	 	},

	 };


	 // Base component (inherit)
	 function TabComponent(tabsComponent) {
	 	if (!tabsComponent instanceof TabsComponent) {
			throw new Error('Unknown tabsComponent object');
		}

	 	this.tabsComponent = tabsComponent;
	 }

	 TabComponent.prototype = {
	 	init() {	 		
	 		var tab = {
	 			title: function() {
	 				return this.title;
	 			}.bind(this),
	 			select: function(isSelect) {
	 				this.logisticForm.style.display = isSelect ? 'block' : 'none';
	 			}.bind(this)
	 		};

	 		this.boxBodyElement = document.querySelector('.box');
	 		this.render();	 		
	 		this.tabsComponent.addTab(tab);	 		
	 	}
	 };


	 function CountyTabComponent(tabsComponent) {
	 	TabComponent.call(this, tabsComponent);
	 	this.title = '門市查詢';
	 	this.init();
	 }
	
	 CountyTabComponent.prototype = Object.create(TabComponent.prototype, {
	 	init: {
	 		value: function() {
	 			TabComponent.prototype.init.apply(this);
				this.setComponentElement();
	 			this.registerEventListener().fetchCounty();

	 			// Set the stores select disabled intially.
	 			// this.logisticForm.querySelector('select[name="store"]').setAttribute('disabled', '');
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},
	 	render: {
	 		value: function() {	 	
	 			var div = document.createElement('div');

	 			div.innerHTML = 
					`<div class="container-fluid">
						<div class="row">
							<div class="col-md-6 col-sm-12 col-12">
								<div class="logistic-container" style="margin: 1.2rem 0;">
									<div class="logistic-heading text-center">
										<h5 class="logistic-title"></h5>
									</div>
									<div class="logistic-content">
										<form name="$county" novalidate>
											<div class="form-group clearfix">
												<label class="form-control-label required-field">選擇縣市</label>												
												<div class="material-select">
													<select type="text" name="county" class="form-control"></select>
												</div>
												<span class="help-block error-block basic-block">請選擇縣市</span>												
											</div>
											<div class="form-group clearfix">
												<label class="form-control-label">選擇鄉、鎮、市、區</label>
												<div class="material-select">
													<select type="text" name="zone" class="form-control"></select>
												</div>
												<span class="help-block error-block basic-block">請選擇縣市</span>												
											</div>
											<div class="form-group clearfix">
												<label class="form-control-label required-field">選擇街道</label>
												<div class="material-select">
													<select type="text" name="road" class="form-control"></select>
												</div>
												<span class="help-block error-block basic-block">請選擇縣市</span>												
											</div>
										</form>
									</div>			
								</div>
							</div>
							<div class="col-md-6 col-sm-12 col-12">
								<div class="list-view-group" style="margin: 1.2rem 0;">
									<div class="list-view-group-caption">
										<label class="caption">搜尋結果</label>
										<div class="alert alert-danger alert-animate" style="margin-top: .3rem; margin-left: 1rem;">目前門市不提供配送服務</div> 
									</div>
									<div class="list-view-group-content"></div>
								</div>
							</div>
						</div>	
					</div>`;
				
				this.boxBodyElement.appendChild(div);
				this.boxBodyElement.querySelector('.logistic-title').textContent = '請選擇門市';				
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},
	 	setComponentElement: {
	 		value: function() {
	 			this.listView = document.querySelector('.list-view-group-content');
	 			this.logisticForm = this.boxBodyElement.querySelector('form[name="$county"]');	 			
	 			this.countyElement = this.logisticForm.querySelector('select[name="county"]');
	 			this.zoneElement = this.logisticForm.querySelector('select[name="zone"]');
	 			this.roadElement = this.logisticForm.querySelector('select[name="road"]');
	 			return this;
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},
	 	registerEventListener: {
	 		value: function() {
	 			var countyCache = {};
	 			var alert = this.listView.previousElementSibling.querySelector('.alert-danger');

				/**
				 * Parse the response with DOMParser
				 * @deprecated
	 			var _parseStoreOptionsFromIbon = function(template) {
	 				var domParser = new DOMParser();	 	
	 				var htmlDocument = this.domParser.parseFromString(template, 'text/html');
	 				var storeOptions = htmlDocument.querySelectorAll('tr');

	 				storesCache[countyId] = [];

	 				for (var i=1; i<storeOptions.length; i++) {
	 					var item = {
	 						id: storeOptions[i].children[0].textContent,
	 						name: storeOptions[i].children[1].textContent,
	 						address: storeOptions[i].children[2].textContent
	 					};

	 					storesCache[countyId].push(item);
	 				}

	 				return this;
	 			}.bind(this);
				*/

	 			var _isAddErrorClassInFormGroup = function(selectElement, isError = true) {
	 				var formGroup = selectElement.closest('div.form-group');

	 				if (!formGroup) {
	 					return;
	 				}

 					return isError ? formGroup.classList.add('has-error') : formGroup.classList.remove('has-error');
 				};

				/**
				 * Render store items in options of select
				 * @access private
				 */	 			
				var _renderSelectElement = function(element, data = []) {
					if (!element) {
						throw new TypeError("Undefined element of selector");
					}

					var option = document.createElement('option');

					option.setAttribute('hidden', '');
					option.innerHTML = '--請選擇--';
					option.value = "";

					element.innerHTML = "";					
					element.appendChild(option);

					if (!data || !data.length) {
						return element.setAttribute('disabled', '');						
					}

					var fragment = document.createDocumentFragment();
					element.removeAttribute('disabled');

					for (var i=0; i<data.length; i++) {
						option = document.createElement('option');

						if (data[i].indexOf('+') >  -1) {
							var collection = data[i].split('+');

							option.innerHTML = collection[1];							
							option.value = collection[0];
						} else {
							option.innerHTML = data[i];
							option.value = data[i];							
						}

						fragment.appendChild(option);
					}

					return element.appendChild(fragment);
				};

				var _renderListView = function(data = null) {
					var listViewItem = '';

					alert.classList.remove('active');
					
					if (!data || !data.length) {
						return this.listView.innerHTML = "";
					}

					for (var i=0; i<data.length; i++) {
	 					// explode the item of store into store array
	 					// [0 => storeId, 1 => road, 2 => address, 3 => status, 4 => storeId]
	 					
	 					var store = data[i].split('+');
	 					
	 					listViewItem += `
	 						<div class="list-view-group-item ${store[3] === 'disable' ? 'disabled' : ''}" data-address="${store[2]}">
								<div class="list-view-group-wrap">
									<div class="list-view-group-item-title">${store[1]}門市</div>
									<div class="list-view-group-item-detail">${store[2]}</div>
								</div>
								<div class="list-view-group-wrap">
									<div class="list-view-group-item-detail">店號: ${store[0]}</div>
								</div>
								<div class="list-view-group-wrap">
									<div class="list-view-group-item-title">${store[3] === 'enable' ? '正常配送' : '暫停服務'}</div>
								</div>
							</div>`;
	 				}

	 				this.listView.innerHTML = listViewItem;
				}.bind(this);

	 			var _selectCountyOption = function(event) {
	 				var self = this;
	 				var params = Object.assign({}, this.tabsComponent.store);
	 				var optionValue = event.target.value.split('|');
	 				var countyId = optionValue[0];
	 				
	 				// _isAddErrorClassInFormGroup(event.target, false);
	 				// this.logisticForm.querySelector('select[name="store"]').removeAttribute('disabled');

	 				_renderListView();

	 				if (countyCache[countyId]) {
	 					_renderSelectElement(this.zoneElement, countyCache[countyId].zone);
	 					_renderSelectElement(this.roadElement, countyCache[countyId].road);
	 					return;
	 				}

	 				this.tabsComponent.store.loader.active(true);

	 				params.name = 'county';
	 				params.methods = 'zone|road';
	 				params.county = optionValue[1];
	 				params.components = undefined;

	 				FetchRequest.get({
	 					url: URL.SERVER.STORES, 
	 					data: params
	 				})
	 				.then(FetchRequest.callSuccessResponse, FetchRequest.callErrorResponse)
	 				.then(function(data) {
	 					countyCache[countyId] = data;
	 					_renderSelectElement(self.zoneElement, data.zone);
	 					_renderSelectElement(self.roadElement, data.road);
	 				})
	 				.finally(function() {
						self.tabsComponent.store.loader.active(false);
	 				});
	 			}.bind(this);

	 			var _selectZoneOption = function(event) {
	 				var self = this;
	 				var params = Object.assign({}, this.tabsComponent.store);

	 				var handleResultCallback = function(data) {
	 					return _renderSelectElement(this.roadElement, data.road);
	 				}.bind(this);

	 				_renderListView();
	 				this.tabsComponent.store.loader.active(true);

	 				params.name = 'county';
	 				params.methods = 'road';
	 				params.county = this.countyElement.value.split('|')[1];
	 				params.zone = event.target.value;

	 				params.components = null;
					params.loader = null;

	 				FetchRequest.get({
	 					url: URL.SERVER.STORES,
	 					data: params
	 				})
	 				.then(FetchRequest.callSuccessResponse, FetchRequest.callErrorResponse)
	 				.then(handleResultCallback)
	 				.finally(function() {
	 					self.tabsComponent.store.loader.active(false);
	 				});

	 			}.bind(this);

	 			var _selectRoadOption = function(event) {
	 				var self = this;
	 				var params = Object.assign({}, this.tabsComponent.store);

	 				var handleResultCallback = function(data) {	 				
	 					return _renderListView(data);		
	 				};

	 				this.tabsComponent.store.loader.active(true);

	 				params.name = 'county';
	 				params.methods = 'store';
	 				params.county = this.countyElement.value.split('|')[1];
	 				params.zone = this.zoneElement.value;
	 				params.road = event.target.value;

	 				params.components = null;
					params.loader = null;

	 				FetchRequest.get({
	 					url: URL.SERVER.STORES,
	 					data: params
	 				})
	 				.then(FetchRequest.callSuccessResponse, FetchRequest.callErrorResponse)
	 				.then(handleResultCallback)
	 				.finally(function() {
	 					self.tabsComponent.store.loader.active(false);
	 				});
	 				
	 			}.bind(this);

	 			var _selectStoreItem = (function() {
	 				var selector = '.list-view-group-item';
	 				// var getCurrentElementIndex = function(listViewItem) {
	 				// 	return Array.prototype.slice.call(this.listView.querySelectorAll(selector)).indexOf(listViewItem);
	 				// }.bind(this);

	 				var clickListViewItemProcess = function(listViewItem) {
	 					if (listViewItem.classList.contains('disabled')) {
	 						return alert.classList.add('active');
	 					}

	 					if (!listViewItem.getAttribute('data-address')) {
	 						throw new Error('Undefiend address of listViewItem');
	 					}
	 					
	 					// postMessage to origin website 
		 				if (!window.opener  || window.opener.closed) {
		 					throw new Error('The origin website does not exist.');
		 				}

		 				this.tabsComponent.store.loader.active(true);
		 				// window.opener.postMessage({}, URL.DOMAIN);	 			
		 				Util.postMessage({address: listViewItem.getAttribute('data-address'), logisticId: this.tabsComponent.store.logisticId});	 				
		 				setTimeout(function() { window.close(); }, 500);
	 				}.bind(this);

	 				return function(event) {
	 					var listViewItem = event.target.closest(selector);
	 					return listViewItem && clickListViewItemProcess(listViewItem);
	 				};
	 			}).bind(this)();

	 		// 	var _filterStoresByInput = function(event) {
	 				
	 		// 		if (countyId === undefined || !Object.keys(storesCache).length) {
	 		// 			return;
	 		// 		}

	 		// 		if (!event.target.value) {
	 		// 			return _renderStoreOptions();
	 		// 		}

	 		// 		var stores = storesCache[countyId].filter(function(store) {
	 		// 			return store.address.indexOf(event.target.value) > -1;
	 		// 		});

	 		// 		return _renderStoreOptions(stores);

	 		// 	}.bind(this);

				
	 			document.addEventListener('DOMContentLoaded', function() {
	 				this.countyElement.onchange = _selectCountyOption;
	 				this.zoneElement.onchange = _selectZoneOption;
	 				this.roadElement.onchange = _selectRoadOption;
	 				this.listView.onclick = _selectStoreItem;
	 				// this.logisticForm.querySelector('select[name="store"]').onchange = _selectCountyOptions;
	 				// this.logisticForm.querySelector('button[type="submit"]').onclick = _submitLogisticInformation;
	 			}.bind(this));

	 			return this;
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},

	 	fetchCounty: {
	 		value: function() {
	 			var self = this;
	 			
	 			var callback = function(counties) {	 				
	 				var fragment = document.createDocumentFragment();
	 				var blankOption = document.createElement('option');

	 				blankOption.setAttribute('hidden', '');
	 				blankOption.setAttribute('selected', '');
	 				fragment.appendChild(blankOption);

	 				for (var i=0; i<counties.length; i++) {
	 					var option = document.createElement('option');

	 					option.innerHTML = counties[i].name;
	 					option.value = counties[i].id + '|' + counties[i].name;
	 					fragment.appendChild(option);
	 				}

	 				self.logisticForm.querySelector('select[name="county"]').appendChild(fragment);
	 			};

	 			fetch(URL.SERVER.COUNTIES, {
	 				method: 'GET',
	 				mode: 'cors',
	 				cache: 'reload'
	 			})
	 			.then(FetchRequest.callSuccessResponse, FetchRequest.callErrorResponse)
	 			.then(callback)
	 			.finally(function() {
	 				self.tabsComponent.store.loader.active(false);
	 			});
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	}

	 });


	function MapTabComponent() {

	}

	function AddressComponent(tabsComponent) {
	 	TabComponent.call(this, tabsComponent);	
	 	
	 	this.title = '住址查詢';
	 	this.init();
	}

	AddressComponent.prototype = Object.create(TabComponent.prototype, {
	 	init: {
	 		value() {
	 			TabComponent.prototype.init.apply(this);
	 			this.logisticForm = this.boxBodyElement.querySelector('form[name="$address"]');
	 			this.registerEventListener();
	 			this.fetchDistrictAddress();
	 			this.tabsComponent.store.loader.active(false);
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},


	 	/**
	 	 * Render the address view.
	 	 * 
	 	 * @warning It's not work for adding class in option element css (like :hover :checked)
	 	 * 
	 	 */
	 	render: {
	 		value() {
	 			var div = document.createElement('div');

				div.innerHTML = 
					`<div class="container-fluid">
						<div class="row">
							<div class="col-md-8 col-sm-12 col-12 offset-md-2">
								<div class="logistic-container" style="margin: 1.2rem 0;">
									<div class="logistic-heading text-center">
										<h5 class="logistic-title"></h5>
									</div>
									<div class="logistic-content">
										<form name="$address" novalidate>
											<div class="form-group has-feedback clearfix">
												<div class="material-select">
													<select name="county" class="form-control" placeholder="城市" required></select>
												</div>
												<span class="help-block error-block basic-block">請選擇城市</span>
											</div>
											<div class="form-group has-feedback clearfix">
												<div class="material-select">
													<select name="district" class="form-control" placeholder="區" required></select>
												</div>
												<span class="help-block error-block basic-block">請選擇地區</span>
											</div>
											<div class="form-group has-feedback clearfix">
												<input type="text" name="district-id" class="form-control" placeholder="郵遞區號" onkeypress="return event.charCode >= 48 && event.charCode <= 57" required>
												<span class="help-block error-block basic-block">請輸入郵遞區號</span>
											</div>
											<div class="form-group has-feedback clearfix">
												<input type="text" name="address" class="form-control" placeholder="樓層、街/路" required>
												<span class="help-block error-block basic-block">請輸入地址</span>
											</div>
											<div class="logistic-action text-center">
												<button type="submit" class="btn btn-material width-fixed no-transform">確認</button>
											</div>
										</form>
									</div>			
								</div>
							</div>							
						</div>	
					</div>`;

				this.boxBodyElement.appendChild(div);				
				this.boxBodyElement.querySelector('.logistic-title').textContent = '請選擇住址';				
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},

	 	registerEventListener: {
	 		value() {
	 			/**
	 			 * The global varible to determine whether the all input is checked. 
	 			 * @param bool
	 			 */
	 			var isSubmit;

	 			var _selectCountyOptions = function(event) {
	 				var districtSelect = this.logisticForm.querySelector('select[name="district"]');
	 				var districtIdInput = this.logisticForm.querySelector('input[name="district-id"]');
	 				var selectedOption = event.target.querySelectorAll('option')[event.target.selectedIndex];
	 				var districts = JSON.parse(selectedOption.getAttribute('data-districts') || '[]');
	 				
	 				if  (!districts) {
	 					return;
	 				}

	 				var fragment = document.createDocumentFragment();

	 				districtSelect.innerHTML = '<option hidden>區</option>';
	 				districtIdInput.value = "";
	 				event.target.closest('.form-group').classList.remove('has-error');

	 				for (var key in districts) {
	 					var option = document.createElement('option');

	 					option.setAttribute('data-district-id', districts[key]);
	 					option.value = `${key}`;
	 					option.innerHTML = key;
	 					fragment.appendChild(option);
	 				}

	 				districtSelect.disabled = false;
	 				districtSelect.appendChild(fragment);

	 			}.bind(this);

	 			var _selectDistrictOptions = function(event) {
	 				var selectedOption = event.target.querySelectorAll('option')[event.target.selectedIndex];
	 				var districtIdInput = this.logisticForm.querySelector('input[name="district-id"]');
	 				
	 				event.target.closest('.form-group').classList.remove('has-error');
	 				districtIdInput.value = selectedOption.getAttribute('data-district-id');
	 				districtIdInput.focus();
	 				districtIdInput.blur();	 				
	 			}.bind(this);


	 			var _validateInputEmpty = function(event) {
	 				if (event.target.value) {
	 					return event.target.closest('.form-group').classList.remove('has-error');	 					
	 				}

	 				event.target.closest('.form-group').classList.add('has-error');
	 				return isSubmit = false;
	 			};

	 			var _submitLogisticInformation = function(event) {
	 				event.preventDefault();

	 				var allInputElements = this.logisticForm.querySelectorAll('input');
	 				var allSelectElements = this.logisticForm.querySelectorAll('select');
	 				
	 				isSubmit = true;

	 				// Validate the whole input and select is empty.

	 				for (var i=0; i<allSelectElements.length; i++) {
	 					allInputElements[i].focus();
	 					allInputElements[i].blur();
	 				}

	 				for (var i=0; i<allSelectElements.length; i++) {
	 					if (allSelectElements[i].selectedIndex == 0) {
	 						isSubmit = false;
	 						allSelectElements[i].closest('.form-group').classList.add('has-error');
	 						break;
	 					}

	 					allSelectElements[i].closest('.form-group').classList.remove('has-error');
	 				}

	 				if (!isSubmit) {
	 					return;
	 				}

	 				var address = `${allInputElements[0].value} ${allSelectElements[0].value}${allSelectElements[1].value}${allInputElements[1].value}`;
	 				Util.postMessage({logisticId: this.tabsComponent.store.logisticId, address: address});

	 				setTimeout(function() { window.close() }, 300);
	 			}.bind(this);


	 			document.addEventListener('DOMContentLoaded', function() {
	 				this.logisticForm.querySelector('select[name="county"]').onchange = _selectCountyOptions;
	 				this.logisticForm.querySelector('select[name="district"]').onchange = _selectDistrictOptions;
	 				this.logisticForm.querySelectorAll('input').forEach(function(input) { 
	 					input.onkeyup = _validateInputEmpty;
	 					input.onblur = _validateInputEmpty;
	 				}.bind(this));

	 				this.logisticForm.querySelector('[type="submit"]').onclick = _submitLogisticInformation;
	 			}.bind(this));
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	},

	 	renderCountyOptions: {
 			value(data) {
 				var fragment = document.createDocumentFragment();
 				var countySelect = this.logisticForm.querySelector('select[name="county"]'); 				
 				var districtSelect = this.logisticForm.querySelector('select[name="district"]');
 				var blankOption = document.createElement('option');


 				blankOption.setAttribute('hidden', '');
 				blankOption.innerHTML = '區';

 				districtSelect.disabled = true;
 				districtSelect.innerHTML = `<option hidden="">區</option>`;

 				blankOption.innerHTML = '城市';	 				
 				fragment.appendChild(blankOption);

 				for (var key in data) {
 					var option = document.createElement('option');

 					option.setAttribute('data-districts', JSON.stringify(data[key]));
 					option.value = key;
 					option.textContent = key;

 					fragment.appendChild(option);
 				}

 				return countySelect.appendChild(fragment);
 			},
 			enumerable: true,
 			configurable: true,
 			writable: true
	 	},

	 	fetchDistrictAddress: {
	 		value() {
	 			
	 			var _fetchDistricts = function() {
	 				return FetchRequest.jsonp({url: URL.REMOTE.DISTRICTS});
	 			};

	 			window.webpackJsonp = function(id, response) {
	 				// response is county
	 				var data = {};

	 				switch (Object.keys(response)[0]) {
	 					case '479': 
	 						response['479'](data);
	 						console.log(data.exports);
							// _renderOptions(data.exports);	 						
	 						break;

	 					case '483':
	 						response['483'](data);
	 						console.log(data.exports);
	 						this.renderCountyOptions(data.exports);
	 						break;
	 				}	 			
	 			}.bind(this);

	 			_fetchDistricts();
	 		},
	 		enumerable: true,
	 		configurable: true,
	 		writable: true
	 	}

	});


	/**
	 * Singleton service handler
	 *
	 * @anthor Mong Cheng
	 */
	var ProxyService = (function() {
		var instance;

		return function(service) {
			return instance || (instance = service.apply(this, arguments));
		};
	})();

	var EventListener = function(){};

	var Util = {};

	Util.parseUrlQueryParamters = function(url) {
		var parameters = {};

		url.split('&').forEach(function(part) {
			var items = part.split('=');
			parameters[items[0]] = decodeURIComponent(items[1]);
		});

		return parameters;
	};

	Util.newCallPrototype = function() {
		var Class = Array.prototype.shift.call(arguments);

		return new (Function.prototype.bind.apply(Class, arguments));
	};

	Util.getJsonFromUrl = function(hashBased) {
		var query;

		 if(hashBased) {
    		var pos = location.href.indexOf("?");
    		
    		if(pos==-1){
    			return [];	
    		} 

    		query = location.href.substr(pos+1);
  		} else {
    		query = location.search.substr(1);
  		}

  		var result = {};
  		query.split("&").forEach(function(part) {
    	
	    	if(!part) {
	    		return;	
	    	} 
	    	
	    	part = part.split("+").join(" "); // replace every + with space, regexp-free version
	    	var eq = part.indexOf("=");
	    	var key = eq>-1 ? part.substr(0,eq) : part;
	    	var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
	    	var from = key.indexOf("[");
	    	if(from==-1) {
	    		result[decodeURIComponent(key)] = val;
	    	} else {
	    		var to = key.indexOf("]",from);
	      		var index = decodeURIComponent(key.substring(from+1,to));
	      		key = decodeURIComponent(key.substring(0,from));
	      		
	      		if(!result[key]) {
	      			result[key] = [];	
	      		} 

	      		if(!index) {
	      			result[key].push(val);	
	      		} else {
	      			result[key][index] = val;
	      		}
	    	} 	

	  	});
  		
  		return result;
	};

	Util.postMessage = function(data) {
		if (!window.opener  || window.opener.closed) {
	 		throw new Error('The origin website does not exist.');
	 	}

	 	window.opener.postMessage(data, URL.DOMAIN);	 	
	};

	Util.loadImage = function(url) {

		return new Promise(function(resolve, reject) {
			var img = document.createElement('img');

			img.addEventListener('load', function() { resolve(img); });
			img.addEventListener('error', function() { reject(new Error(`Failed to load img url ${url}`)); });

			img.src = url;
		});
	};


	/**
   	 * Image preloader
     * @param {Object} options
     */
  	var ImagePreloader = function(options) {
		this.options = options || {};
		this.options.parallel = this.options.parallel || false;
		this.items = new Array();
		this.max = 0;
	};

	/**
     * The `queue` methods is intended to add an array (a deck) of images to the
     * queue. It does not preload the images though; only adds them to the queue.
     * @param  {Array} array - Array of images to add the queue
     * @return {Promise}
     */
     ImagePreloader.prototype.queue = function(array) {
     	if (Array.isArray(array)) {
     		array = [array];
     	}

     	this.max = array.length;

     	var deferred = defer();

     	this.items.push({
     		collection: array,
     		deferred: deferred
     	});

     	return deferred.promise;
     };

    /**
     * The `preloadImage` preloads the image resource living at `path` and returns
     * a promise that resolves when the image is successfully loaded by the 
     * browser or if there is an error. Beware, the promise is not rejected in 
     * case the image cannot be loaded; it gets resolved nevertheless.
     * @param  {String} path - Image url
     * @return {Promise}
     */
     ImagePreloader.prototype.preloadImage = function(path) {
     	return new Promise(function(resolve, reject) {
     		var image = new Image();

     		image.onload = resolve;
     		image.reject = reject;
     		image = path;
     	});
     };

    /**
     * The `preload` method preloads the whole queue of decks added through the
     * `queue` method. It returns a promise that gets resolved when all decks have
     * been fully loaded.
     * The decks are loaded either sequencially (one after the other) or in
     * parallel, depending on the `parallel` options.
     * @return {Promise}
     */
     ImagePreloader.prototype.preload = function() {
     	var stack = new Array();

     	if (this.options.parallel) {

     		for (var i=0; i<this.max; i++) {
     			this.items[i].forEach(function(item) {
 					if (typeof item !== 'undefined') {
 						item.collection[i] = this.preloadImage(item.collection[i]);
 					}
     			}, this);
     		}

     	} else {
     		this.items.forEach(function(item) {
     			item.collection = item.collection.map(this.preloadImage);
     		});
     	}

     	this.items.forEach(function(item) {
     		var item = Promise.all(item.collection)
     			.then(item.deferred.resolve.bind(item.deferred))
        		.catch(console.log.bind(console));

        	stack.push(item);
     	});

     	return Promise.all(stack);

     // 	preloader.queue(data)
     //    .then(function () {
     //      console.log('Deck ' + index + ' loaded.');
     //      node.classList.add('loaded');
     //    })
    	// .catch(console.error.bind(console));

     };	



	var IbonStore = function() {
		this.name = '7-11便利商店';
		this.brand = 'ibon';
		this.components = [CountyTabComponent, MapTabComponent];

		// Common instance 
		this.init = function() {
			new TabsComponent(this);
		}.bind(this);
	};

	var FamilyStore = function() {
		this.name = '全家便利商店';
		this.brand = 'family';
		this.components = [CountyTabComponent, MapTabComponent];
		
		// Common instance 
		this.init = function() {
			new TabsComponent(this);
		};
	};

	var HiLifeStore = function() {
		this.name = '萊爾富便利商店';
		this.brand = 'hilife';
		this.components = [CountyTabComponent, MapTabComponent];

		// Common instance 
		this.init = function() {
			new TabsComponent(this);
		};
	};

	var BlackcatStore = function() {
		this.name = '黑貓宅急便';
		this.brand = 'blackcat';
		this.components = [AddressComponent];

		// Common instance 
		this.init = function() {
			new TabsComponent(this);
		};
	};

	var PostStore = function() {
		this.name = '郵局';
		this.brand = 'post';
		this.components = [AddressComponent];

		// Common instance 
		this.init = function() {
			new TabsComponent(this);
		};
	};	


	var StoreService = function(options) {
		this.loader = new ProxyService(Loader);
		this.options = options;
	};

	StoreService.prototype = {
		set store(store) {
			this._store = store;
		},

		get store() {
			return this._store;
		},

		init() {
			// obejct extned()
			Object.assign(this.store, this.options, {loader: this.loader});
			
			this.loader.active(true);
			this.render();
			
			this.store.init();
		},

		render() {
			var textBox = document.querySelector('.text-box');

			Util.loadImage(this.store.profile).then(function(img) {
				img.classList.add('img-brand');
				textBox.prepend(img);
			});

			textBox.querySelector('.outline').textContent = this.store.name;
		}

	};


	StoreService.brandList = {
		ibon: IbonStore,
		family: FamilyStore,
		hilife: HiLifeStore,
		blackcat: BlackcatStore, 
		post: PostStore
	};

	var Logistic = function() {
		this.util = Util;
		this.init();
	};

	Logistic.prototype.init = function() {
		var urlParameters = this.util.parseUrlQueryParamters(window.location.search.substr(1));
		
		if (!urlParameters || !urlParameters.brand || !StoreService.brandList[urlParameters.brand]) {
			throw new Error('Undefined or unknown variable brand in the url.');
		}

		var storeService = new StoreService(urlParameters);
		storeService.store = new StoreService.brandList[urlParameters.brand]();
		storeService.init();
	};


	return Logistic;
})();


new Logistic();


/**
install a JSONP callback for chunk loading

var parentJsonpFunction = window["webpackJsonp"];
window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
	// add "moreModules" to the modules object,
	// then flag all "chunkIds" as loaded and fire callback
	var moduleId, chunkId, i = 0, callbacks = [];
	for(;i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
	
		if(installedChunks[chunkId])	
			callbacks.push.apply(callbacks, installedChunks[chunkId]);	
	
		installedChunks[chunkId] = 0;
	}
	
	for(moduleId in moreModules) {
		modules[moduleId] = moreModules[moduleId];
	}

	if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
	
	while(callbacks.length)
		callbacks.shift().call(null, __webpack_require__);
}; 

 */
