<?php
if( (substr($_SERVER['REMOTE_ADDR'], 0, 3) == '10.') || (substr($_SERVER['REMOTE_ADDR'], 0, 7) == '172.16.') || (substr($_SERVER['REMOTE_ADDR'], 0, 8) == '192.168.')) {
	echo($_SERVER['REMOTE_ADDR']);
} else {
	die('Access denied from IP ' . $_SERVER['REMOTE_ADDR'] );
}
?>

