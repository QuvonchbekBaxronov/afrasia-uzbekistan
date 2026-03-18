<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['title', 'video_url', 'description', 'duration_seconds', 'user_id', 'course_id'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getResolvedUrlAttribute()
    {
        if (!$this->video_url) {
            return null;
        }

        if (filter_var($this->video_url, FILTER_VALIDATE_URL)) {
            return $this->video_url;
        }

        $defaultDisk = config('filesystems.default');
        $disk = $defaultDisk === 'local' ? 'public' : $defaultDisk;

        try {
            return \Illuminate\Support\Facades\Storage::disk($disk)->url($this->video_url);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
