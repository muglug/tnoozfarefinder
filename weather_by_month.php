<?php

$places = [];

$start_date = mktime(0, 0, 0, 11, 1, 2014);
$end_date = mktime(0, 0, 0, 11, 1, 2015);

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

$ch = curl_init("http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datatypeid=TAVG&locationid=CITY:UK000009&limit=1000&startdate=". date('Y-m-d', $start_date) . "&enddate=". date('Y-m-d', $end_date) . "&offset=" . ($i * 1000));
curl_setopt_array($ch, $options);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
	'token:lTzobBOVgDhzkiKklhEWtDhBEHekGiHb'
]);

$result = curl_exec($ch);

// close cURL resource, and free up system resources
curl_close($ch);

$results = json_decode($result)->results;

$months = [];

foreach ($results as $city_info) {
	$month = (int)substr($city_info->date, 5, 2);
	$months[$month][] = $city_info->value;
}

$average_months = [];

foreach ($months as $key => $values) {
	$average_months[$key] = ((array_sum($values) / count($values)) - 32) * 5 / 9;
}

echo json_encode($average_months);