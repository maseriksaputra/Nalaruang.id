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
        $diskUsage = $this->getDiskUsage();
        $objectStorage = $this->getObjectStorageSize();
        
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
                
            Stat::make('Local Storage', $diskUsage['percentage'] . '%')
                ->description($diskUsage['used'] . ' GB / ' . $diskUsage['total'] . ' GB Terpakai')
                ->descriptionIcon('heroicon-m-hard-drive')
                ->color($diskUsage['percentage'] > 80 ? 'warning' : 'success'),
                
            Stat::make('Object Storage', $objectStorage['size_formatted'])
                ->description($objectStorage['file_count'] . ' File Media Tersimpan')
                ->descriptionIcon('heroicon-m-cloud')
                ->color('info'),
        ];
    }

    private function getDiskUsage(): array
    {
        try {
            $path = base_path();
            $totalSpace = disk_total_space($path);
            $freeSpace = disk_free_space($path);
            $usedSpace = $totalSpace - $freeSpace;
            
            $totalGb = round($totalSpace / 1024 / 1024 / 1024, 2);
            $usedGb = round($usedSpace / 1024 / 1024 / 1024, 2);
            $percentage = $totalGb > 0 ? round(($usedGb / $totalGb) * 100) : 0;
            
            return [
                'percentage' => $percentage,
                'used' => $usedGb,
                'total' => $totalGb
            ];
        } catch (\Exception $e) {
            return ['percentage' => 0, 'used' => 0, 'total' => 0];
        }
    }

    private function getObjectStorageSize(): array
    {
        try {
            // Count size of storage/app/public directory
            $dir = storage_path('app/public');
            if (!is_dir($dir)) {
                return ['size_formatted' => '0 MB', 'file_count' => 0];
            }
            
            $size = 0;
            $count = 0;
            
            // Recursive iterator
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir));
            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $size += $file->getSize();
                    $count++;
                }
            }
            
            // Format size
            $units = ['B', 'KB', 'MB', 'GB', 'TB'];
            $unit = 0;
            while ($size >= 1024 && $unit < count($units) - 1) {
                $size /= 1024;
                $unit++;
            }
            
            return [
                'size_formatted' => round($size, 2) . ' ' . $units[$unit],
                'file_count' => $count
            ];
        } catch (\Exception $e) {
            return ['size_formatted' => '0 MB', 'file_count' => 0];
        }
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
