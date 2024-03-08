<?php

header('content-type: application/json');

$from = strtotime(filter_input(INPUT_GET, 'from'));
$till = strtotime(filter_input(INPUT_GET, 'till'));

$current = $from;

$state = [];

while ($current <= $till) {
    $state[date('Y-m-d', $current)] = [
        'disabled' => rand(0, 1) ? true : false,
        'html' => date('d', $current).' <b>asd</b>',
    ];
    // Add day
    $current += 60 * 60 * 24;
}
echo json_encode($state);