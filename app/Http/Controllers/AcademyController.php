<?php

namespace App\Http\Controllers;

use App\Models\Academy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AcademyController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Academies/Index', [
            'academies' => Academy::query()
                ->ordered()
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'specialty' => ['nullable', 'string', 'max:255'],
            'founded' => ['nullable', 'string', 'max:4'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'photos.*' => ['nullable', 'image', 'max:2048'],
            'social_media' => ['nullable', 'array'],
            'social_media.facebook' => ['nullable', 'url'],
            'social_media.instagram' => ['nullable', 'url'],
            'social_media.twitter' => ['nullable', 'url'],
            'social_media.website' => ['nullable', 'url'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('academies/logos', 'public');
        }

        // Handle photos upload
        if ($request->hasFile('photos')) {
            $photos = [];
            foreach ($request->file('photos') as $photo) {
                $photos[] = $photo->store('academies/photos', 'public');
            }
            $validated['photos'] = $photos;
        }

        Academy::create($validated);

        return back()->with('success', 'Academy created successfully.');
    }

    public function update(Request $request, Academy $academy): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'specialty' => ['nullable', 'string', 'max:255'],
            'founded' => ['nullable', 'string', 'max:4'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'photos.*' => ['nullable', 'image', 'max:2048'],
            'social_media' => ['nullable', 'array'],
            'social_media.facebook' => ['nullable', 'url'],
            'social_media.instagram' => ['nullable', 'url'],
            'social_media.twitter' => ['nullable', 'url'],
            'social_media.website' => ['nullable', 'url'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($academy->logo) {
                Storage::disk('public')->delete($academy->logo);
            }
            $validated['logo'] = $request->file('logo')->store('academies/logos', 'public');
        }

        // Handle photos upload
        if ($request->hasFile('photos')) {
            // Delete old photos
            if ($academy->photos) {
                foreach ($academy->photos as $photo) {
                    Storage::disk('public')->delete($photo);
                }
            }
            $photos = [];
            foreach ($request->file('photos') as $photo) {
                $photos[] = $photo->store('academies/photos', 'public');
            }
            $validated['photos'] = $photos;
        }

        $academy->update($validated);

        return back()->with('success', 'Academy updated successfully.');
    }

    public function destroy(Academy $academy): RedirectResponse
    {
        // Delete logo
        if ($academy->logo) {
            Storage::disk('public')->delete($academy->logo);
        }

        // Delete photos
        if ($academy->photos) {
            foreach ($academy->photos as $photo) {
                Storage::disk('public')->delete($photo);
            }
        }

        $academy->delete();

        return back()->with('success', 'Academy deleted successfully.');
    }

    public function deletePhoto(Request $request, Academy $academy): RedirectResponse
    {
        $validated = $request->validate([
            'photo' => ['required', 'string'],
        ]);

        $photos = $academy->photos ?? [];
        $photoToDelete = $validated['photo'];

        if (in_array($photoToDelete, $photos)) {
            Storage::disk('public')->delete($photoToDelete);
            $academy->photos = array_values(array_filter($photos, fn($p) => $p !== $photoToDelete));
            $academy->save();
        }

        return back()->with('success', 'Photo deleted successfully.');
    }

    public function getPublished()
    {
        return response()->json([
            'academies' => Academy::query()
                ->published()
                ->ordered()
                ->get(),
        ]);
    }
}
