<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CmsBlock extends Model
{
    protected $fillable = [
        'page_id',
        'type',
        'data',
        'sort_order',
        'is_enabled',
    ];

    protected $casts = [
        'data' => 'array',
        'is_enabled' => 'boolean',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(CmsPage::class, 'page_id');
    }
}
