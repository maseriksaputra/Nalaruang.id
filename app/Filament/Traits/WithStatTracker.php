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
     * @return Stat
     */
    protected function makeTrackedStat($label, $value, string $storageKey, string $formattedValue = null): Stat
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
                init() {
                    let key = 'stat_tracker_{$storageKey}';
                    let stored = localStorage.getItem(key);
                    if (stored !== null) {
                        let prev = parseInt(stored);
                        if (!isNaN(prev)) {
                            this.diff = this.current - prev;
                        }
                    }
                    localStorage.setItem(key, this.current);
                }
            }\" style=\"display: flex; align-items: center; gap: 0.5rem;\">
                <span>{$displayValue}</span>
                
                <span x-show=\"diff > 0\" x-cloak
                    x-transition:enter=\"transition ease-out duration-300\"
                    x-transition:enter-start=\"opacity-0 transform scale-90 -translate-x-2\"
                    x-transition:enter-end=\"opacity-100 transform scale-100 translate-x-0\"
                    style=\"display: none; align-items: center; gap: 2px; padding: 2px 6px; border-radius: 9999px; background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.2);\">
                    <svg style=\"width: 12px; height: 12px;\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"currentColor\">
                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18\" />
                    </svg>
                    +<span x-text=\"diff\"></span>
                </span>
                
                <span x-show=\"diff < 0\" x-cloak
                    x-transition:enter=\"transition ease-out duration-300\"
                    x-transition:enter-start=\"opacity-0 transform scale-90 -translate-x-2\"
                    x-transition:enter-end=\"opacity-100 transform scale-100 translate-x-0\"
                    style=\"display: none; align-items: center; gap: 2px; padding: 2px 6px; border-radius: 9999px; background-color: rgba(244, 63, 94, 0.1); color: #f43f5e; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(244, 63, 94, 0.2);\">
                    <svg style=\"width: 12px; height: 12px;\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"3\" stroke=\"currentColor\">
                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3\" />
                    </svg>
                    <span x-text=\"Math.abs(diff)\"></span>
                </span>
            </div>
        ");

        return Stat::make($label, $html);
    }
}
