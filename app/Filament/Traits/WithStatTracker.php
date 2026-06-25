<?php

namespace App\Filament\Traits;

use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\HtmlString;

trait WithStatTracker
{
    /**
     * Wrap a stat value with an Alpine.js tracker to show increments since last seen.
     *
     * @param string|\Illuminate\Contracts\Support\Htmlable $label Widget label
     * @param mixed $value The raw numeric value (for tracking)
     * @param string $storageKey Unique key for LocalStorage
     * @param string|null $formattedValue The formatted display value (optional)
     * @param string $mode Mode tracker ('refresh' atau 'daily')
     * @return Stat
     */
    protected function makeTrackedStat($label, $value, string $storageKey, string $formattedValue = null, string $mode = 'refresh'): Stat
    {
        $displayValue = $formattedValue ?? (string) $value;
        $numericValue = is_numeric($value) ? $value : preg_replace('/[^0-9\-]/', '', $value);
        
        if (empty($numericValue) && !is_numeric($numericValue)) {
            $numericValue = 0;
        }

        $html = new HtmlString("
            <div x-data=\"{
                current: {$numericValue},
                diff: 0,
                animatedDiff: '0',
                mode: '{$mode}',
                animateDiff(target) {
                    let start = null;
                    const duration = 2000;
                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        let progress = Math.min((timestamp - start) / duration, 1);
                        let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        let val = 0 + (target - 0) * ease;
                        this.animatedDiff = new Intl.NumberFormat('id-ID').format(Math.round(val));
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            this.animatedDiff = new Intl.NumberFormat('id-ID').format(Math.round(target));
                        }
                    };
                    window.requestAnimationFrame(step);
                },
                init() {
                    let key = 'stat_tracker_{$storageKey}';
                    let dateKey = 'stat_date_{$storageKey}';
                    let today = new Date().toDateString();
                    
                    let storedVal = localStorage.getItem(key);
                    let storedDate = localStorage.getItem(dateKey);
                    
                    if (this.mode === 'daily') {
                        // Mode Harian: Reset hanya jika ganti hari
                        if (storedDate !== today || storedVal === null) {
                            localStorage.setItem(dateKey, today);
                            localStorage.setItem(key, this.current);
                            this.diff = 0;
                        } else {
                            let prev = parseInt(storedVal);
                            if (!isNaN(prev)) {
                                this.diff = this.current - prev;
                            }
                        }
                    } else {
                        // Mode Refresh: Hilang setiap kali halaman di-refresh
                        if (storedVal !== null) {
                            let prev = parseInt(storedVal);
                            if (!isNaN(prev)) {
                                this.diff = this.current - prev;
                            }
                        }
                        localStorage.setItem(key, this.current);
                    }
                    
                    if (this.diff !== 0) {
                        this.animateDiff(Math.abs(this.diff));
                    }
                }
            }\" style=\"display: flex; align-items: center; gap: 0.5rem;\">
                <span>{$displayValue}</span>
                
                <span x-show=\"diff > 0\" x-cloak
                    x-transition:enter=\"transition ease-out duration-300\"
                    x-transition:enter-start=\"opacity-0 transform scale-90 -translate-x-2\"
                    x-transition:enter-end=\"opacity-100 transform scale-100 translate-x-0\">
                    <span style=\"display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; border-radius: 9999px; background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.2);\">
                        <svg style=\"width: 12px; height: 12px;\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"currentColor\">
                            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18\" />
                        </svg>
                        +<span x-text=\"animatedDiff\"></span>
                    </span>
                </span>
                
                <span x-show=\"diff < 0\" x-cloak
                    x-transition:enter=\"transition ease-out duration-300\"
                    x-transition:enter-start=\"opacity-0 transform scale-90 -translate-x-2\"
                    x-transition:enter-end=\"opacity-100 transform scale-100 translate-x-0\">
                    <span style=\"display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; border-radius: 9999px; background-color: rgba(244, 63, 94, 0.1); color: #f43f5e; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(244, 63, 94, 0.2);\">
                        <svg style=\"width: 12px; height: 12px;\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"currentColor\">
                            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3\" />
                        </svg>
                        <span x-text=\"animatedDiff\"></span>
                    </span>
                </span>
            </div>
        ");

        return Stat::make($label, $html);
    }

    /**
     * Wrap a stat value with a backend-provided diff badge.
     *
     * @param string|\Illuminate\Contracts\Support\Htmlable $label Widget label
     * @param mixed $displayValue The formatted display value
     * @param float|int $diff The numeric difference to display (e.g., added today)
     * @return Stat
     */
    protected function makeBackendTrackedStat($label, $displayValue, $diff): Stat
    {
        $html = new HtmlString("
            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">
                <span>{$displayValue}</span>
                
                " . ($diff > 0 ? "
                <span 
                    x-data=\"{
                        target: " . abs($diff) . ",
                        current: 0,
                        formatted: '0',
                        animate() {
                            let start = null;
                            const duration = 2000;
                            const step = (timestamp) => {
                                if (!start) start = timestamp;
                                let progress = Math.min((timestamp - start) / duration, 1);
                                let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                                let val = this.current + (this.target - this.current) * ease;
                                this.formatted = new Intl.NumberFormat('id-ID').format(Math.round(val));
                                if (progress < 1) {
                                    window.requestAnimationFrame(step);
                                } else {
                                    this.formatted = new Intl.NumberFormat('id-ID').format(Math.round(this.target));
                                }
                            };
                            window.requestAnimationFrame(step);
                        }
                    }\"
                    x-init=\"animate()\"
                    style=\"display: inline-flex; flex-direction: row; flex-wrap: nowrap; white-space: nowrap; align-items: center; gap: 2px; padding: 2px 6px; border-radius: 9999px; background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.2);\">
                    <svg style=\"width: 12px; height: 12px;\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"currentColor\">
                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18\" />
                    </svg>
                    +<span x-text=\"formatted\"></span>
                </span>" : "") . "
                
                " . ($diff < 0 ? "
                <span 
                    x-data=\"{
                        target: " . abs($diff) . ",
                        current: 0,
                        formatted: '0',
                        animate() {
                            let start = null;
                            const duration = 2000;
                            const step = (timestamp) => {
                                if (!start) start = timestamp;
                                let progress = Math.min((timestamp - start) / duration, 1);
                                let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                                let val = this.current + (this.target - this.current) * ease;
                                this.formatted = new Intl.NumberFormat('id-ID').format(Math.round(val));
                                if (progress < 1) {
                                    window.requestAnimationFrame(step);
                                } else {
                                    this.formatted = new Intl.NumberFormat('id-ID').format(Math.round(this.target));
                                }
                            };
                            window.requestAnimationFrame(step);
                        }
                    }\"
                    x-init=\"animate()\"
                    style=\"display: inline-flex; flex-direction: row; flex-wrap: nowrap; white-space: nowrap; align-items: center; gap: 2px; padding: 2px 6px; border-radius: 9999px; background-color: rgba(244, 63, 94, 0.1); color: #f43f5e; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(244, 63, 94, 0.2);\">
                    <svg style=\"width: 12px; height: 12px;\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"currentColor\">
                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3\" />
                    </svg>
                    <span x-text=\"formatted\"></span>
                </span>" : "") . "
            </div>
        ");

        return Stat::make($label, $html);
    }
}
