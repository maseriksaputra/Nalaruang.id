<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get($key, $default = null)
    {
        return \Illuminate\Support\Facades\Cache::rememberForever("setting_{$key}", function () use ($key, $default) {
            if (!\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                return $default;
            }

            $setting = self::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value by key.
     *
     * @param string $key
     * @param mixed $value
     * @return \App\Models\Setting
     */
    public static function set($key, $value)
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            return false;
        }

        $setting = self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
        
        \Illuminate\Support\Facades\Cache::forget("setting_{$key}");
        
        return $setting;
    }
}
