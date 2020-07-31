import initialization from './run/initialization';
import loadIcon from './run/loadIcon';


angular.module('jingcafe.admin.run', [])
	.run(initialization)
	.run(loadIcon)