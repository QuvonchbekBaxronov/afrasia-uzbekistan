<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'avatar',
        'status',
        'password',
        'is_verified',
        'verification_code',
        'is_admin',
        'payment_id',
        'address',
        'phone',
        'is_teacher',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_student')
            ->withTimestamps()
            ->withPivot('enrolled_at');
    }
    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) .
                   '&background=10b981&color=fff&size=150&bold=true&font-size=0.5';
        }

        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }

        $defaultDisk = config('filesystems.default');
        $disk = $defaultDisk === 'local' ? 'public' : $defaultDisk;

        return \Illuminate\Support\Facades\Storage::disk($disk)->url($this->avatar);
    }

    public function subject()
    {
        return $this->hasOne(Subject::class, 'teacher_id');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'teacher_id');
    }
}
