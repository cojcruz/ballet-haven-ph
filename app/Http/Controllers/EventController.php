<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('start_date', 'desc')->get();

        return Inertia::render('events/Index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'details' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'registration_link' => 'nullable|url|max:255',
            'featured_image' => 'nullable|image|max:2048',
            'featured' => 'boolean',
            'published' => 'boolean',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('events', 'public');
        }

        Event::create($validated);

        return redirect()->route('events.index')->with('success', 'Event created.');
    }

    public function edit(Event $event)
    {
        return Inertia::render('events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'details' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'registration_link' => 'nullable|url|max:255',
            'featured_image' => 'nullable|image|max:2048',
            'featured' => 'boolean',
            'published' => 'boolean',
        ]);

        if ($request->hasFile('featured_image')) {
            if ($event->featured_image) {
                Storage::disk('public')->delete($event->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('events', 'public');
        }

        $event->update($validated);

        return redirect()->route('events.index')->with('success', 'Event updated.');
    }

    public function destroy(Event $event)
    {
        if ($event->featured_image) {
            Storage::disk('public')->delete($event->featured_image);
        }
        $event->delete();

        return redirect()->route('events.index')->with('success', 'Event deleted.');
    }

    public function publicIndex()
    {
        $events = Event::where('published', true)
            ->where('start_date', '>=', now()->subDays(1))
            ->orderBy('featured', 'desc')
            ->orderBy('start_date', 'asc')
            ->get();

        return response()->json($events);
    }
}
