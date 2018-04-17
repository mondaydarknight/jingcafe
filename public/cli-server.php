<?php


if (php_sapi_name() !== 'cli-server') {
	throw new Exception('Only PHP Server access');
}

// if (is_file($_SERVER['DOCUMENT_ROOT']) . '/' . $_SERVER['SCRIPT_NAME']) {
// 	return false;
// }

if (preg_match('/\.(?:png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
	$_SERVER['SCRIPT_NAME'] = 'index.php';
}

require_once 'index.php';
