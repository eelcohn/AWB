<?php
$CURL_TIMEOUT = 5;

if ((isset($_SERVER['HTTP_X_REQUEST_URL'])) && ($_SERVER['HTTP_X_REQUEST_URL'] != '')) {
	$headers = array();

	if (isset($_SERVER['HTTP_CACHE_CONTROL'])) {
		$headers[] = 'Cache-Control: ' . $_SERVER['HTTP_CACHE_CONTROL'];
	} else {
		$headers[] = 'Cache-Control: no-cache, no-store, must-revalidate, max-age=0';
	}

	if (isset($_SERVER['HTTP_PRAGMA'])) {
		$headers[] = 'Pragma: ' . $_SERVER['HTTP_PRAGMA'];
	} else {
		$headers[] = 'Pragma: no-cache';
	}

	if (isset($_SERVER['HTTP_X_USER_AGENT'])) {
		$headers[] = 'User-Agent: ' . $_SERVER['HTTP_X_USER_AGENT'];
	}

	switch($_SERVER['REQUEST_METHOD']) {
		case 'GET' :
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $_SERVER['HTTP_X_REQUEST_URL']);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $CURL_TIMEOUT);
			$data = curl_exec($ch);

			if(!curl_errno($ch)) {
				http_response_code(curl_getinfo($ch, CURLINFO_HTTP_CODE));
				if (curl_getinfo($ch,  CURLINFO_CONTENT_TYPE) !== null) {
					header('Content-Type: ' . curl_getinfo($ch,  CURLINFO_CONTENT_TYPE));
				}
				header('X-CORSProxy-Total-Time: ' . curl_getinfo($ch, CURLINFO_TOTAL_TIME));
				echo($data);
			} else {
				header('X-CORSProxy-Error: ' . curl_errno($ch));
				http_response_code(500);
			}
			curl_close($ch);
//			echo(file_get_contents($_SERVER['HTTP_X_REQUEST_URL']));
			break;

		default :
			http_response_code(405);
			break;
	}
} else {
	http_response_code(400);
}
?>
