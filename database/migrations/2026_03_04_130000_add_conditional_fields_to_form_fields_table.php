<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('form_fields', function (Blueprint $table) {
            $table->string('conditional_field')->nullable()->after('width');
            $table->string('conditional_value')->nullable()->after('conditional_field');
            $table->json('repeater_fields')->nullable()->after('conditional_value');
        });
    }

    public function down(): void
    {
        Schema::table('form_fields', function (Blueprint $table) {
            $table->dropColumn(['conditional_field', 'conditional_value', 'repeater_fields']);
        });
    }
};
