

class UrlFactory {

	constructor() {

	}

	parseUrl(url) {
		const parser = document.createElement('a');
		const searchObject = {};
		const queries = parser.search.replace(/^\?/, '').split('&');
		let split;

		parser.href = url;

		for (let i=0; i<queries.length; i++) {
			split = queries[i].split('=');
			searchObject[split[0]] = split[1];
		}

		return {
			protocol: parser.protocol,
			host: parser.host,
			hostname: parser.hostname,
			port: parser.port,
			pathname: parser.pathname,
			search: parser.search,
			searchObject,
			hash: parser.hash
		};
	}


	static setup() {
		return new UrlFactory(...arguments);
	}
}


export default UrlFactory;