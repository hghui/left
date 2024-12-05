<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$consName = isset($_GET['consName']) ? $_GET['consName'] : '巨蟹座';
$type = isset($_GET['type']) ? $_GET['type'] : 'today';
$key = '4a11bbcbf089edaf14c2d9bdb80c2ec4';

$url = "http://web.juhe.cn:8080/constellation/getAll?consName={$consName}&type={$type}&key={$key}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?> 