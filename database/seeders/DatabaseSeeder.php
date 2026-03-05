<?php

namespace Database\Seeders;

use App\Models\CmsPage;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Site Admin',
            'email' => 'admin@abap-inc.org',
            'password' => Hash::make('ab@p2026!'),
        ]);

        $page = CmsPage::query()->firstOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Home',
                'is_published' => true,
                'is_home' => false,
                'meta' => [],
            ],
        );

        if ($page->wasRecentlyCreated) {
            $page->blocks()->createMany([
                [
                    'type' => 'hero',
                    'data' => [
                        'title' => 'Association of Ballet Academies of the Philippines',
                        'subtitle' => "Edit this hero block in the dashboard CMS.",
                    ],
                    'sort_order' => 1,
                    'is_enabled' => true,
                ],
                [
                    'type' => 'rich_text',
                    'data' => [
                        'text' => "This is a rich text block.\n\nYou can replace this content with anything you want.",
                    ],
                    'sort_order' => 2,
                    'is_enabled' => true,
                ],
            ]);
        }
    }
}
