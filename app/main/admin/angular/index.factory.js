import DocumentFactory 	from './factories/DocumentFactory';
import EventListener	from './factories/EventListener';
import FileUploader 	from './factories/FileUploader';

import ToolFactory 		from './factories/ToolFactory';
import Util 			from './factories/Util';



angular.module('jingcafe.admin.factories', [])
	.factory('DocumentFactory', DocumentFactory.setup)
	.factory('EventListener', EventListener)
	.factory('FileUploader', FileUploader.setup)
	.factory('ToolFactory', ToolFactory.setup)
	.factory('Util', Util.setup)

