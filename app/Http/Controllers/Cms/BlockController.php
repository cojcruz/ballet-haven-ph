<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsBlock;
use App\Models\CmsPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function store(Request $request, CmsPage $page): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'data' => ['nullable'],
            'sort_order' => ['required', 'integer'],
            'is_enabled' => ['required', 'boolean'],
        ]);

        $page->blocks()->create([
            'type' => $validated['type'],
            'data' => $this->normalizeData($validated['data'] ?? null, $validated['type']),
            'sort_order' => $validated['sort_order'],
            'is_enabled' => $validated['is_enabled'],
        ]);

        return redirect()->route('cms.pages.edit', $page);
    }

    public function update(Request $request, CmsPage $page, CmsBlock $block): RedirectResponse
    {
        abort_unless($block->page_id === $page->id, 404);

        $validated = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'data' => ['nullable'],
            'sort_order' => ['required', 'integer'],
            'is_enabled' => ['required', 'boolean'],
        ]);

        $block->update([
            'type' => $validated['type'],
            'data' => $this->normalizeData($validated['data'] ?? null, $validated['type']),
            'sort_order' => $validated['sort_order'],
            'is_enabled' => $validated['is_enabled'],
        ]);

        return redirect()->route('cms.pages.edit', $page);
    }

    public function destroy(Request $request, CmsPage $page, CmsBlock $block): RedirectResponse
    {
        abort_unless($block->page_id === $page->id, 404);

        $block->delete();

        return redirect()->route('cms.pages.edit', $page);
    }

    private function normalizeData(mixed $data, string $type): ?array
    {
        if ($data === null) {
            return null;
        }

        if (is_array($data)) {
            return $data;
        }

        if (is_string($data)) {
            $trimmed = trim($data);

            if ($trimmed === '') {
                return null;
            }

            $decoded = json_decode($trimmed, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }

            if ($type === 'rich_text') {
                return ['html' => $data];
            }

            return ['text' => $data];
        }

        return null;
    }
}
