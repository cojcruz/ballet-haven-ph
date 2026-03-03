<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('submit_button_text')->default('Submit');
            $table->text('success_message')->nullable();
            $table->string('redirect_url')->nullable();
            $table->boolean('send_email_notification')->default(false);
            $table->string('notification_email')->nullable();
            $table->boolean('published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};
