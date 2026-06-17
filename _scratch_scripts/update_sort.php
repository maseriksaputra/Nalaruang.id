<?php

$dir = __DIR__ . '/app/Filament/Widgets';
$sorts = [
    'StatsOverview' => 1,
    'CashflowChart' => 2,
    'SalesTrendChart' => 3,
    'OrderStatsOverview' => 4,
    'ServiceRevenuePieChart' => 5,
    'TopProductsChart' => 6,
    'GuestEngagementStats' => 7,
    'VisitorTrendChart' => 8,
    'RsvpOverviewChart' => 9,
    'TopInvitationsTable' => 10,
    'TopProductsTable' => 11
];

foreach ($sorts as $class => $sort) {
    $file = "$dir/$class.php";
    if (!file_exists($file)) continue;
    
    $content = file_get_contents($file);
    if (preg_match('/protected static \?int \$sort = \d+;/', $content)) {
        $content = preg_replace('/protected static \?int \$sort = \d+;/', "protected static ?int \$sort = $sort;", $content);
    } else {
        $content = preg_replace('/class '.$class.' extends (BaseWidget|ChartWidget)\s*\{/', "class $class extends $1\n{\n    protected static ?int \$sort = $sort;", $content);
    }
    
    file_put_contents($file, $content);
    echo "Updated $class to sort $sort\n";
}
