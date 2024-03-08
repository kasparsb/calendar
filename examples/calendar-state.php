<?php

header('content-type: application/json');

$isV2 = intval(filter_input(INPUT_GET, 'v')) == 2;

$from = strtotime(filter_input(INPUT_GET, 'from'));
$till = strtotime(filter_input(INPUT_GET, 'till'));

$current = $from;

$state = [];

while ($current <= $till) {

    if ($isV2) {
        $state[date('Y-m-d', $current)] = [
            'disabled' => rand(0, 1) ? true : false,
            'html' => date('d', $current).' <b>V2</b>',
            'cssClass' => 'random-'.rand(1, 4).' x',
        ];
    }
    else {
        $state[date('Y-m-d', $current)] = [
            'disabled' => rand(0, 1) ? true : false,
            'html' => date('d', $current).' <b>asd</b>',
            'cssClass' => 'random-'.rand(1, 4).' asdasd',
        ];
    }
    // Add day
    $current += 60 * 60 * 24;
}
echo json_encode($state);