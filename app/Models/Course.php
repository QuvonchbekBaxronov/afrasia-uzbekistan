<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'description', 'duration_hours', 'is_active', 'sertificate_template', 'user_id', 'img' , 'course_type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Bu kursga ro'yxatdan o'tgan talabalar
    public function students()
    {
        return $this->belongsToMany(User::class, 'course_student')
            ->withTimestamps();
    }
    public function videos()
    {
        return $this->hasMany(Video::class);
    }
    // app/Models/Course.php ichiga qo'shing:

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function getThumbnailUrlAttribute()
    {
        if (!$this->img) {
            return asset('assets/images/placeholder.jpg');
        }

        if (filter_var($this->img, FILTER_VALIDATE_URL)) {
            return $this->img;
        }

        $defaultDisk = config('filesystems.default');
        $disk = $defaultDisk === 'local' ? 'public' : $defaultDisk;

        try {
            return \Illuminate\Support\Facades\Storage::disk($disk)->url($this->img);
        } catch (\Throwable $e) {
            return asset('assets/images/placeholder.jpg');
        }
    }
}
