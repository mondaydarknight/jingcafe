
class ErrorHandler {

	constructor($document, $timeout, ToolFactory, toastr, CONSTANTS) {
		this.$document = $document;
		this.$timeout = $timeout;
		this.ToolFactory = ToolFactory;
		this.toastr = toastr;
		this.CONSTANTS = CONSTANTS;
	}

	parse(error) {
		const _alertByConsole = () => this.ToolFactory.consoleError(errorMessage);
		const _alertByToast = () => this.toastr.error(errorMessage);
		const _alertByFormGroupElement = () => {
			const inputElement = this.$document[0].body.querySelector(`[name="${errorDetailConfig[1]}"]`);
			const formGroupElement = inputElement.closest('.form-group');
			const keyupFormGroupEvent = (event) => {
				formGroupElement.classList.remove('has-error');
				formGroupElement.removeEventListener('keyup', keyupFormGroupEvent);
			};

			this.$timeout(() => inputElement.focus());			
			formGroupElement.classList.add('has-error');
			formGroupElement.addEventListener('keyup', keyupFormGroupEvent);
		};

		const _getElementName = () => errorDetailConfig[1];
		const _getErrorCode = () => errorDetailConfig[0];
		const _getErrorMessage = () => errorMessage;
		const _hasToastError = () => !!errorDetailConfig;
		const _hasFormGroupElementError = () => errorDetailConfig && errorDetailConfig.length > 1;
		
		let errorConfig = error.split('.');
		let errorDetailConfig;
		let errorMessage;

		if (!errorConfig.length) {
			throw new TypeError('Unknown or empty of error message.');
		} else if (errorConfig.length == 1 || !errorConfig[1]) {
			errorMessage = errorConfig[0];
		} else {
			errorDetailConfig = errorConfig[1].split('|');

			if (!errorConfig || !this.CONSTANTS[errorConfig[0]] || !this.CONSTANTS[errorConfig[0]][errorDetailConfig[0]]) {
				throw new Error('Undefined error message in Config CONSTANTS');
			}

			errorMessage = this.CONSTANTS[errorConfig[0]][errorDetailConfig[0]];
		}


		return {
			alertByConsole: _alertByConsole,
			alertByToast: _alertByToast,
			alertByFormGroupElement: _alertByFormGroupElement,
			getElementName: _getElementName,
			getErrorCode: _getErrorCode,
			getErrorMessage: _getErrorMessage,
			hasToastError: _hasToastError,
			hasFormGroupElementError: _hasFormGroupElementError
		};

	}

}

export default ErrorHandler;