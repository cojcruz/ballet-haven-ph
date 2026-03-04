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
        'conditional_field',
        'conditional_value',
        'repeater_fields',
        'html_content',
        'allowed_file_types',
        'auto_populate_from',
    ];

    protected $casts = [
        'options' => 'array',
        'validation_rules' => 'array',
        'required' => 'boolean',
        'repeater_fields' => 'array',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }
}
