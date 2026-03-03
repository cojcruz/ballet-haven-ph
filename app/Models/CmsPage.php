<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CmsPage extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'is_published',
        'is_home',
        'meta',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_home' => 'boolean',
        'meta' => 'array',
    ];

    public function blocks(): HasMany
    {
        return $this->hasMany(CmsBlock::class, 'page_id')->orderBy('sort_order');
    }
}
