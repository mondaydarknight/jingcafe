

class FileUploader {

	constructor($q, $http) {
		'ngInject';

		this.$q = $q;
		this.$http = $http;
	}

	/**
	 * HTTP: POST
	 * Upload file method 
	 *
	 * @param string 	serverUrl
	 * @param obejcts 	formData
	 * @param string 	httpMethod	POST | PUT method
 	 * 
 	 * @return deferred callback
	 */
	upload(serverUrl, formData, httpMethod = 'POST') {
		if (!serverUrl || !formData.keys) {
			throw new Error('Undefined variable url or empty formData');
		}

		return this.$http({
			url: serverUrl,
			method: httpMethod,
			headers: {
				'Content-Type': undefined
			},
			data: formData,
			transformRequest: angular.identity
		});
	}

	
	buildFileConfiguration(file) {
		let fileList = {
			name: 			file.name,
			size: 			file.size,
			sizeCapacity: 	this.bytesToText(file.size),
			type: 			file.type,
			format: 		file.type ? file.type.split('/', 1).toString().toLowerCase() : '',
			extension: 		file.name.indexOf('.') != -1 ? file.name.split('.').pop().toLowerCase() : '',
			class: 			{},
			data: 			file.data,
			file: 			file.file || file,
			isUploading: 	true,
			view: 			{ isImage: false }
		};

		fileList.class.format = `file-type-${fileList.format ? fileList.format : 'no'}`;
		fileList.class.extension = `file-ext-${fileList.extension ? fileList.extension : 'no'}`;
		
		fileList.view = this.generateCustomIcon(fileList.format, fileList.extension);

		return fileList;
	} 

	/**
	 * Calculate the bytes of file size and convert to text 
	 * @param bytes
	 * @retrun string (number.unit)
	 */
	bytesToText(bytes) {
		if (bytes === 0) {
			return `0 Byte`;
		}

		let k = 1000;
		let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let index = Math.floor(Math.log(bytes) / Math.log(k));

		return `${(bytes / Math.pow(k, index)).toPrecision(3)} ${sizes[index]}`;
	}

	/**
	 * Determine whether the canvas is blank
	 *
	 * @return bool
	 */ 
	 isCanvasBlank(canvas) {
	 	let blank = document.createElement('canvas');

	 	blank.width = canvas.width;
	 	blank.height = canvas.height;

	 	return canvas.toDataURL() == blank.toDataURL();
	}

	renderImageCanvas(img) {
		const deferred = this.$q.defer();
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		let image = new Image();

		image.onload = (event) => {
			canvas.height = 36;
			canvas.width = 36;

			let heightRatio = image.height / canvas.height;
			let widthRatio = image.width / canvas.width;
			let optimalRatio = heightRatio < widthRatio ? heightRatio : widthRatio;
			let optimalHeight = image.height / optimalRatio;
			let optimalWidth = image.width / optimalRatio;

			// Resize the canvas 
			if (image.width >= canvas.width || image.height >= canvas.height) {
				const oc = document.createElement('canvas');
				const octx = oc.getContext('2d');

				oc.width = image.width * 0.5;
				oc.height = image.height * 0.5;

				octx.fillStyle = '#fff';
				octx.fillRect(0, 0, oc.width, oc.height);
				octx.drawImage(image, 0, 0, oc.width, oc.height);
				octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

				context.drawImage(
					oc, 
					optimalWidth > canvas.width ? optimalWidth - canvas.width : 0, 
					0, 
					oc.width * 0.5, 
					oc.height * 0.5, 
					0, 
					0, 
					optimalWidth, 
					optimalHeight
				);
			}

			image = null;

			if (!this.isCanvasBlank(canvas)) {
				deferred.resolve(canvas.toDataURL());
			}
		};

		image.onerror = (event) => deferred.reject(event);

		image.src = img;

		return deferred.promise;
	}

	/**
	 * Generate respective icon
	 * @access public
	 */
	generateCustomIcon(format, extension) {
		let icon = {};
		let backgroundColor = this._convertTextToColor(extension);

		if (backgroundColor) {
			if (this._isBrightColor(backgroundColor)) {
				icon.class = 'is-bright-color';
			}

			icon.style = backgroundColor;
		}

		return icon;
	}

	/**
	 * Determine the browser window support FileReader API
	 * @retrun bool
	 */
	isFileReaderSupported() {
		return window.File && window.FileList && window.FileReader;
	}

	/**
	 * Convert the icon text to color
	 * @access private
	 */
	 _convertTextToColor(extension) {
	 	if (!extension || !extension.length) {
	 		return;
	 	}

	 	for (var i = 0, hash = 0; i < extension.length; hash = extension.charCodeAt(i++) + ((hash << 5) - hash));
            for (var i = 0, color = '#'; i < 3; color += ('00' + ((hash >> i++ * 2) & 0xFF).toString(16)).slice(-2));

      	return color;
	 }

	/**
	 * Determine the background color is bright or dark
	 * @return bool
	 * @access private
	 */
	_isBrightColor(color) {
		const getRGB = (b) => {
			let a;

			if (b && b.constructor == Array && b.length == 3) 
				return b;
			if (a = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) 
				return [parseInt(a[1]), parseInt(a[2]), parseInt(a[3])];
			if (a = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b)) 
				return [parseFloat(a[1]) * 2.55, parseFloat(a[2]) * 2.55, parseFloat(a[3]) * 2.55];
			if (a = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) 
				return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3],16)];
			if (a = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) 
				return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)];
					
			return (typeof colors != "undefined") ? colors[b.trim().toLowerCase()] : null;
		};

		const getLuminance = (color) => {
			let rgb = getRGB(color);

			return rgb ? (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) : 0;
		};

		return getLuminance(color) > 194;
	}

	static setup() {
		return new FileUploader(...arguments);
	}

}

FileUploader.setup.$inject = ['$q', '$http'];

export default FileUploader;
