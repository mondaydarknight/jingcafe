
function elementDisplay(EventListener, ToolFactory) {
	return {
		restrict: 'A',
		scope: false,
		link: (scope, element, attr, ctrl) => {
			const handler = (EventListener, element, attr) => {
				EventListener.addElement(attr.elementDisplay);

				return (elementName, isDisplay) => {
					if (EventListener.getElements().indexOf(elementName) > -1 && attr.elementDisplay === elementName) {
						return isDisplay ? element.fadeIn() : element.fadeOut();
					}
				};
			};

			EventListener.on('display', handler(EventListener, element, attr));

			if (attr.initDisplay) {
				EventListener.broadcast('display', attr.elementDisplay, ToolFactory.isBoolean(attr.initDisplay));
			}
		}
	};
}



elementDisplay.$inject = ['EventListener', 'ToolFactory'];

export const elementDisplayDirective = elementDisplay;
