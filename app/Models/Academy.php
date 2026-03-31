<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Academy extends Model
{
    protected $fillable = [
        'name',
        'email',
        'location',
        'specialty',
        'founded',
        'logo',
        'social_media',
        'photos',
        'description',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'social_media' => 'array',
        'photos' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['logo_url', 'photo_urls'];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }

    public function getPhotoUrlsAttribute(): array
    {
        if (!$this->photos) {
            return [];
        }

        return array_map(function ($photo) {
            return asset('storage/' . $photo);
        }, $this->photos);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
