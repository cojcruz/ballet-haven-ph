<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormField extends Model
{
    protected $fillable = [
        'form_id',
        'type',
        'label',
        'name',
        'placeholder',
        'help_text',
        'default_value',
        'options',
        'validation_rules',
        'required',
        'order',
        'width',
    ];

    protected $casts = [
        'options' => 'array',
        'validation_rules' => 'array',
        'required' => 'boolean',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }
}
