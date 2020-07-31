
import {btnToggleSidebar}	from './directives/btn-toggle-sidebar';
import {collapsedSidebar} 	from './directives/collapsed-sidebar';

import {editForm}			from './directives/edit-form/edit-form';
import {editFormText}		from './directives/edit-form/edit-form-text';
import {editFormSelect}		from './directives/edit-form/edit-form-select';

import {fileParser}			from './directives/file-parser';

import {loader}				from './directives/loader';

import {sidebarToggleItem} 	from './directives/sidebar-toggle-item';
import {sidebarToggler}		from './directives/sidebar-toggler';
import {sidebarToggleMenu}	from './directives/sidebar-toggle-menu';




angular.module('jingcafe.admin.directives', [])
	.directive('btnToggleSidebar', btnToggleSidebar)
	.directive('collapsedSidebar', collapsedSidebar)

	.directive('editForm', editForm)
	.directive('editFormText', editFormText)
	.directive('editFormSelect', editFormSelect)

	.directive('fileParser', fileParser)

	.directive('loader', loader)

	.directive('sidebarToggleItem', sidebarToggleItem)
	.directive('sidebarToggler', sidebarToggler)
	.directive('sidebarToggleMenu', sidebarToggleMenu)


