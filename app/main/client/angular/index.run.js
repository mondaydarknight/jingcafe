
import initialization 		from './run/initialization';
import loadTemplateCache 	from './run/loadTemplateCache';


angular.module('jingcafe.run', [])
	.run(initialization)
	.run(loadTemplateCache)