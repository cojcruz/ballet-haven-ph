<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles = DB::table('roles')->get()->keyBy('slug');
        
        DB::table('users')->get()->each(function ($user) use ($roles) {
            $roleSlug = $user->role ?? 'viewer';
            $role = $roles->get($roleSlug);
            
            if ($role) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['role_id' => $role->id]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->update(['role_id' => null]);
    }
};
