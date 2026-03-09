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
        'password',
        'role',
        'role_id',
    ];

    public function roleRelation()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function getRoleSlugAttribute(): string
    {
        if ($this->role_id && $this->roleRelation) {
            return $this->roleRelation->slug;
        }
        return $this->role ?? 'viewer';
    }

    public function isAdmin(): bool
    {
        return $this->role_slug === 'admin';
    }

    public function isStaff(): bool
    {
        return $this->role_slug === 'staff';
    }

    public function isViewer(): bool
    {
        return $this->role_slug === 'viewer';
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        if ($this->role_id && $this->roleRelation) {
            $permissions = $this->roleRelation->permissions ?? [];
            return in_array('*', $permissions) || in_array($permission, $permissions);
        }

        return false;
    }

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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
