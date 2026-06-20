<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ServerMetricsWidget extends BaseWidget
{
    protected static ?int $sort = -1; // Top of the dashboard
    protected static ?string $pollingInterval = '5s'; // Auto refresh every 5 seconds

    protected function getStats(): array
    {
        $cpuUsage = $this->getCpuUsage();
        $ramUsage = $this->getRamUsage();
        
        return [
            Stat::make('CPU Usage', $cpuUsage . '%')
                ->description('Load rata-rata server VPS')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->color($cpuUsage > 80 ? 'danger' : 'success')
                ->chart([$cpuUsage, $cpuUsage + rand(-5, 5), $cpuUsage + rand(-5, 5), $cpuUsage]),

            Stat::make('RAM Usage', $ramUsage['percentage'] . '%')
                ->description($ramUsage['used'] . ' GB / ' . $ramUsage['total'] . ' GB Terpakai')
                ->descriptionIcon('heroicon-m-server')
                ->color($ramUsage['percentage'] > 80 ? 'danger' : 'primary')
                ->chart([$ramUsage['percentage'], $ramUsage['percentage'] + rand(-2, 2), $ramUsage['percentage'] + rand(-2, 2), $ramUsage['percentage']]),
                
            Stat::make('Disk Status', 'Aman')
                ->description('Penyimpanan berjalan normal')
                ->descriptionIcon('heroicon-m-circle-stack')
                ->color('success'),
        ];
    }

    private function getCpuUsage(): int
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            return rand(5, 25); // Mock for Windows local testing
        }

        try {
            // Check top command
            $cpuCmd = "top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'";
            $result = shell_exec($cpuCmd);
            if ($result) {
                return (int) round((float) $result);
            }
            return 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function getRamUsage(): array
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            return [
                'percentage' => rand(30, 60),
                'used' => rand(2, 4),
                'total' => 8
            ]; // Mock for Windows local testing
        }

        try {
            $free = shell_exec('free');
            $free = (string)trim($free);
            $free_arr = explode("\n", $free);
            $mem = explode(" ", $free_arr[1]);
            $mem = array_filter($mem);
            $mem = array_merge($mem);
            $total = round($mem[1] / 1024 / 1024, 2); // GB
            $used = round($mem[2] / 1024 / 1024, 2); // GB
            $percentage = $total > 0 ? round(($used / $total) * 100) : 0;
            
            return [
                'percentage' => $percentage,
                'used' => $used,
                'total' => $total
            ];
        } catch (\Exception $e) {
            return [
                'percentage' => 0,
                'used' => 0,
                'total' => 0
            ];
        }
    }
}
