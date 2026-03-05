<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home(Request $request)
    {
        $page = CmsPage::query()
            ->where('is_home', true)
            ->where('is_published', true)
            ->with('blocks')
            ->first();

        if (! $page) {
            return Inertia::render('Home');
        }

        return Inertia::render('cms/Show', [
            'page' => $page,
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $page = CmsPage::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->with('blocks')
            ->firstOrFail();

        return Inertia::render('cms/Show', [
            'page' => $page,
        ]);
    }
}
