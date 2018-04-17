<?php

$file = "../app/main/{$_GET['assets']}";

if (file_exists($file)) {
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	$mime = finfo_file($finfo, $file);

	finfo_close($finfo);

	header("Content-Type: $mime");

	readfile($file);
}

