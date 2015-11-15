<?php

$places = [];

if (class_exists('Memcached')) {
	$memcache = new Memcached;
	$memcache->addServer('localhost', 11211) or die ("Could not connect");
}
else {
	$memcache = new Memcache;
	$memcache->connect('localhost', 11211) or die ("Could not connect");
}

function cache_get($key) {
	global $memcache;
	return $memcache->get($key);
}

function cache_set($key, $value, $duration)
{
	global $memcache;
	if (class_exists('Memcached')) {
		$memcache->set($key, $value, $duration) or die ("Failed to save data at the server");
	}
	else {
		$memcache->set($key, $value, false, $duration) or die ("Failed to save data at the server");
	}
}

$city = $_GET['city'];

$cache_key = 'temperc_' . $city;

if (cache_get($cache_key)) {
	echo cache_get($cache_key);
	exit();
}

$options = array(
    CURLOPT_RETURNTRANSFER => true,   // return web page
    CURLOPT_HEADER         => false,  // don't return headers
    CURLOPT_FOLLOWLOCATION => true,   // follow redirects
    CURLOPT_MAXREDIRS      => 10,     // stop after 10 redirects
    CURLOPT_ENCODING       => "",     // handle compressed
    CURLOPT_USERAGENT      => "test", // name of client
    CURLOPT_AUTOREFERER    => true,   // set referrer on redirect
    CURLOPT_CONNECTTIMEOUT => 120,    // time-out on connect
    CURLOPT_TIMEOUT        => 120,    // time-out on response
); 

$ch = curl_init("http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datatypeid=TAVG&locationid=" . $city . "&limit=1&startdate=2014-01-01&enddate=2014-01-03");
curl_setopt_array($ch, $options);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
	'token:lTzobBOVgDhzkiKklhEWtDhBEHekGiHb'
]);

$result = curl_exec($ch);
curl_close($ch);

if (!isset(json_decode($result)->results)) {
	echo '{}';
	exit();
}

$station = json_decode($result)->results[0]->station;

$months = [];

load_months(mktime(0, 0, 0, 12, 1, 2014), mktime(0, 0, 0, 6, 1, 2015));
load_months(mktime(0, 0, 0, 12, 1, 2013), mktime(0, 0, 0, 6, 1, 2014));

function load_months($start_date, $end_date) {
	global $months, $city, $options, $station;

	$ch = curl_init("http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=" . $station . "&datatypeid=TAVG&locationid=" . $city . "&limit=1000&startdate=". date('Y-m-d', $start_date) . "&enddate=". date('Y-m-d', $end_date));
	curl_setopt_array($ch, $options);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
		'token:lTzobBOVgDhzkiKklhEWtDhBEHekGiHb'
	]);

	$result = curl_exec($ch);

	// close cURL resource, and free up system resources
	curl_close($ch);

	$results = json_decode($result)->results;

	foreach ($results as $city_info) {
		$month = (int)substr($city_info->date, 5, 2);
		$months[$month][] = $city_info->value;
	}
}

$average_months = [];

foreach ($months as $key => $values) {
	$average_months[$key] = array_sum($values) / count($values);
}

cache_set($cache_key, json_encode($average_months), 3600 * 5);

echo json_encode($average_months);