<?php
$timeout = 10;

if (!isset($_SERVER['HTTP_X_REQUEST_URL'])) {
    http_response_code(400);
    exit('Missing url');
}

$url = $_SERVER['HTTP_X_REQUEST_URL'];

$headers = [
    'User-Agent: ' . ($_SERVER['HTTP_X_USER_AGENT'] ?? 'Mozilla/5.0'),
    'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language: nl-NL,nl;q=0.9,en-US;q=0.8',
];

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

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => $timeout,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_HTTPHEADER => $headers,
]);

$data = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

curl_close($ch);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: *');

if ($contentType) {
    header('Content-Type: ' . $contentType);
}

http_response_code($httpCode);
echo $data;
