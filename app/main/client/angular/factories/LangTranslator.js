

export default class LangTranslator {

	constructor(CONSTANTS) {
		'ngInject';

		this.CONSTANTS = CONSTANTS;
		this.lang = 'zh-TW';

	}

	set lang(lang) {
		this._lang = lang;
	}

	get lang() {
		return this._lang;
	}


	isSymbolInDictionary(value) {
		
	}

	setup() {
		return new LangTranslator(...arguments);
	}

}

LangTranslator.setup.$inject = ['CONSTANTS'];