<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class SyncUserRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:sync-roles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync user role_id based on their role string';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Syncing user roles...');

        $roles = Role::all()->keyBy('slug');
        $updated = 0;

        User::all()->each(function ($user) use ($roles, &$updated) {
            $roleSlug = $user->role ?? 'viewer';
            $role = $roles->get($roleSlug);

            if ($role && $user->role_id !== $role->id) {
                $user->role_id = $role->id;
                $user->save();
                $updated++;
                $this->line("Updated {$user->name} to role: {$role->name}");
            }
        });

        $this->info("Synced {$updated} users.");
        return 0;
    }
}
