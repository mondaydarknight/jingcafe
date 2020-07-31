import fileTemplate from './file.template.html';

class FileController {

	constructor($document, $scope, $timeout, $state, $attrs, $uibModal, EventListener, FileUploader, toastr, CONSTANTS) {
		'ngInject';

		this.$document = $document;
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$state = $state;
		this.$attrs = $attrs;
		this.$uibModal = $uibModal;
		this.EventListener = EventListener;
		this.FileUploader = FileUploader;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;

	}

	$onInit() {
		this.theme = this.$attrs.theme || 'default';
		this.fileLimit = this.$attrs.fileLimit || 1;
		this.fileAddmore = this.$attrs.fileAddmore;
		this.isDownload = this.$attrs.download;

		this.$file = angular.element(this.$document[0].body.querySelector('input.file'));
		this.$fileItemsList = angular.element(this.$document[0].querySelector('.fileuploader-items-list'));
		this.initFilesystem();	
	}

	$postLink() {
		this.isBeyondLimit = false;
		this.filesMapper = [];
	}

	initFilesystem() {
		if (this.uploadAddmore) {
			this.$file.attr('name', 'files[]').attr('multiple', 'multiple');
		}
	}

	/**
	 * Select file domain
	 * @todo Prevent parent window click event (sidebarEventProcessed) set event.stopPropagation()
	 * @access public
	 */
	 selectFile($event) {
	 	$event.stopPropagation(); 
	 	this.$file.click();
	 }

	 /**
	  * Remove file 
	  *
	  * @access public
	  */
	removeFile(index) {
		if (typeof index !== 'number' || !this.filesMapper[index]) {
			return;
		}

		this.filesMapper.splice(index, 1);
		this.$fileItemsList.find('.fileuploader-item').eq(index).slideUp();
	}

	/**
	 *
	 * @access public
	 */
	addFile(file) {
		if (!file || !Object.keys(file).length) {
			return;
		}

		this.filesMapper.push(file);
		this.fileModel.files = this.filesMapper;
	}

	/**
	 * @access public
	 */
	getCurrentFileIndex() {
		return this.filesMapper.length ? this.filesMapper.length -1 : this.filesMapper.length;
	}

	isBeyondUploadFileLimit() {
		return this.filesMapper.length >= this.fileLimit;
	}


	/**
	 * set uploading completed
	 * @access public
	 */
	uploadFileCompleted(index) {
		this.filesMapper[index].isUploading = this.filesMapper[index] && false;
	}

	/**
	 *
	 * @access pulbic
	 */
	renderImage(index, image) {

		if (!this.filesMapper[index]) {
			return;
		}

		this.FileUploader.renderImageCanvas(image).then((canvas) => {
			this.uploadFileCompleted(index);
			this.filesMapper[index].view.isImage = true;
			this.filesMapper[index].view.canvas = canvas;
		});
	}





	
	set filesMapper(filesMapper) {
		this._filesMapper = filesMapper;
	}

	get filesMapper() {
		return this._filesMapper;
	}

	set theme(theme) {
		this._theme = theme; 
	}

	get theme() {
		return this._theme;
	}

	set fileLimit(fileLimit) {
		this._fileLimit = parseInt(fileLimit, 10);
	}

	get fileLimit() {
		return this._fileLimit;
	}

	set fileAddmore(fileAddmore) {
		this._fileAddmore = !!fileAddmore;
	}
	
	get fileAddmore() {
		return this._fileAddmore;
	}

	set isDownload(isDownload) {
		this._isDownload = !!isDownload;
	}

	get isDownload() {
		return this._isDownload;
	}

}

export const fileComponent = {
	template: fileTemplate,
	controller: FileController,
	controllerAs: '$vm',
	bindings: {
		fileModel: '<'
	}
};


