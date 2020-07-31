
class FileParserController {

	constructor($scope, $q, FileUploader) {
		'ngInject';
		
		this.$scope = $scope;
		this.$q = $q;
		this.FileUploader = FileUploader;
	}

	$onInit() {

	}

	/**
	 * Parse the image file
	 * @return deferred promise
	 */
	parseImageFile(file, index) {
		const deferred = this.$q.defer();
		const fileReader = new FileReader();

		fileReader.onload = (event) => deferred.resolve({fileIndex: index, image: event.target.result}); 
		fileReader.onerror = (event) => deferred.reject(event);

		fileReader.readAsDataURL(file);

		return deferred.promise;
	}

	selectFilePromise($event) {
		if (this.fileUploaderController.isBeyondUploadFileLimit()) {
			this.fileUploaderController.isBeyondLimit = true;
			return this.$scope.$apply();
		}

		this.$q.all(Array.prototype.slice.call($event.target.files, 0).map((file) => {
			const deferred = this.$q.defer();

			file = this.FileUploader.buildFileConfiguration(file);
			this.fileUploaderController.addFile(file);
			let fileIndex = this.fileUploaderController.getCurrentFileIndex();

			if (file.format === 'image') {
				return this.parseImageFile(file.file, fileIndex);
			}

			this.fileUploaderController.uploadFileCompleted(fileIndex);
		})).then((uploadedFiles) => {
			uploadedFiles.forEach((file) => {
				if (!file) {
					return;
				}

				if (typeof file.fileIndex === 'undefined') {
					throw new Error(file);
				}

				this.fileUploaderController.renderImage(file.fileIndex, file.image);				
			});
		});
		
	}

}


function fileParserDirective(CONSTANTS) {
	return {
		restrict: 'A',
		require: ['fileParser', '^file'],
		scope: {},
		controller: FileParserController,
		controllerAs: '$vm',
		link: (scope, element, attr, controller) => {
			const fileParser = controller[0];
			fileParser.fileUploaderController = controller[1];

			element.css(CONSTANTS.FILE.STYLE);

			element.on('change', ($event) => {
				$event.preventDefault();
				if (!$event.target.value) {
					return;
				}

				fileParser.fileUploaderController.isBeyondLimit = false;
				fileParser.selectFilePromise($event);
			});

			scope.$on('destroy', () => element.off('change'));
		}
	};
}


export const fileParser = fileParserDirective;
