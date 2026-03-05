<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('cms/pages/Index', [
            'pages' => CmsPage::query()
                ->orderByDesc('is_home')
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('cms/pages/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:cms_pages,slug'],
            'is_published' => ['required', 'boolean'],
            'is_home' => ['required', 'boolean'],
        ]);

        $slug = $validated['slug'] ?? '';
        $slug = trim($slug) !== '' ? $slug : Str::slug($validated['title']);

        $page = CmsPage::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'is_published' => $validated['is_published'],
            'is_home' => $validated['is_home'],
            'meta' => [],
        ]);

        if ($page->is_home) {
            CmsPage::query()->whereKeyNot($page->id)->update(['is_home' => false]);
        }

        return redirect()->route('cms.pages.edit', $page);
    }

    public function edit(Request $request, CmsPage $page): Response
    {
        $page->load('blocks');

        return Inertia::render('cms/pages/Edit', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, CmsPage $page): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:cms_pages,slug,'.$page->id],
            'is_published' => ['required', 'boolean'],
            'is_home' => ['required', 'boolean'],
        ]);

        $page->update([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'is_published' => $validated['is_published'],
            'is_home' => $validated['is_home'],
        ]);

        if ($page->is_home) {
            CmsPage::query()->whereKeyNot($page->id)->update(['is_home' => false]);
        }

        return redirect()->route('cms.pages.edit', $page);
    }

    public function destroy(Request $request, CmsPage $page): RedirectResponse
    {
        $page->delete();

        return redirect()->route('cms.pages.index');
    }
}
