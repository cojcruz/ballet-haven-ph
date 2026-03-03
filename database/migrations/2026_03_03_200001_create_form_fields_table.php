<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->onDelete('cascade');
            $table->string('type'); // text, email, textarea, select, checkbox, radio, number, date, file, hidden
            $table->string('label');
            $table->string('name');
            $table->text('placeholder')->nullable();
            $table->text('help_text')->nullable();
            $table->text('default_value')->nullable();
            $table->json('options')->nullable(); // For select, checkbox, radio options
            $table->json('validation_rules')->nullable(); // required, min, max, pattern, etc.
            $table->boolean('required')->default(false);
            $table->integer('order')->default(0);
            $table->string('width')->default('full'); // full, half, third
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
