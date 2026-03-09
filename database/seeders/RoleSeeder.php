<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Full system access with all permissions',
                'permissions' => ['*'],
                'is_system' => true,
            ],
            [
                'name' => 'Staff',
                'slug' => 'staff',
                'description' => 'Can manage content (CMS, Events, Forms)',
                'permissions' => ['manage_cms', 'manage_events', 'manage_forms'],
                'is_system' => true,
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'description' => 'Read-only access to dashboard',
                'permissions' => ['view_dashboard'],
                'is_system' => true,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }
    }
}
