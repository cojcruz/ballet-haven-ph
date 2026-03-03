<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormField;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FormController extends Controller
{
    public function index()
    {
        $forms = Form::withCount(['fields', 'submissions'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Forms/Index', [
            'forms' => $forms,
        ]);
    }

    public function create()
    {
        return Inertia::render('Forms/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:forms,slug',
            'description' => 'nullable|string',
            'submit_button_text' => 'nullable|string|max:255',
            'success_message' => 'nullable|string',
            'redirect_url' => 'nullable|url|max:255',
            'send_email_notification' => 'boolean',
            'notification_email' => 'nullable|email|max:255',
            'published' => 'boolean',
            'fields' => 'array',
            'fields.*.type' => 'required|string',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.placeholder' => 'nullable|string',
            'fields.*.help_text' => 'nullable|string',
            'fields.*.default_value' => 'nullable|string',
            'fields.*.options' => 'nullable|array',
            'fields.*.validation_rules' => 'nullable|array',
            'fields.*.required' => 'boolean',
            'fields.*.width' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $form = Form::create([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'submit_button_text' => $validated['submit_button_text'] ?? 'Submit',
            'success_message' => $validated['success_message'] ?? null,
            'redirect_url' => $validated['redirect_url'] ?? null,
            'send_email_notification' => $validated['send_email_notification'] ?? false,
            'notification_email' => $validated['notification_email'] ?? null,
            'published' => $validated['published'] ?? false,
        ]);

        if (!empty($validated['fields'])) {
            foreach ($validated['fields'] as $index => $fieldData) {
                $form->fields()->create([
                    'type' => $fieldData['type'],
                    'label' => $fieldData['label'],
                    'name' => $fieldData['name'],
                    'placeholder' => $fieldData['placeholder'] ?? null,
                    'help_text' => $fieldData['help_text'] ?? null,
                    'default_value' => $fieldData['default_value'] ?? null,
                    'options' => $fieldData['options'] ?? null,
                    'validation_rules' => $fieldData['validation_rules'] ?? null,
                    'required' => $fieldData['required'] ?? false,
                    'order' => $index,
                    'width' => $fieldData['width'] ?? 'full',
                ]);
            }
        }

        return redirect()->route('forms.index')->with('success', 'Form created.');
    }

    public function edit(Form $form)
    {
        $form->load('fields');

        return Inertia::render('Forms/Edit', [
            'form' => $form,
        ]);
    }

    public function update(Request $request, Form $form)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:forms,slug,' . $form->id,
            'description' => 'nullable|string',
            'submit_button_text' => 'nullable|string|max:255',
            'success_message' => 'nullable|string',
            'redirect_url' => 'nullable|url|max:255',
            'send_email_notification' => 'boolean',
            'notification_email' => 'nullable|email|max:255',
            'published' => 'boolean',
            'fields' => 'array',
            'fields.*.type' => 'required|string',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.placeholder' => 'nullable|string',
            'fields.*.help_text' => 'nullable|string',
            'fields.*.default_value' => 'nullable|string',
            'fields.*.options' => 'nullable|array',
            'fields.*.validation_rules' => 'nullable|array',
            'fields.*.required' => 'boolean',
            'fields.*.width' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $form->update([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'submit_button_text' => $validated['submit_button_text'] ?? 'Submit',
            'success_message' => $validated['success_message'] ?? null,
            'redirect_url' => $validated['redirect_url'] ?? null,
            'send_email_notification' => $validated['send_email_notification'] ?? false,
            'notification_email' => $validated['notification_email'] ?? null,
            'published' => $validated['published'] ?? false,
        ]);

        // Delete existing fields and recreate
        $form->fields()->delete();

        if (!empty($validated['fields'])) {
            foreach ($validated['fields'] as $index => $fieldData) {
                $form->fields()->create([
                    'type' => $fieldData['type'],
                    'label' => $fieldData['label'],
                    'name' => $fieldData['name'],
                    'placeholder' => $fieldData['placeholder'] ?? null,
                    'help_text' => $fieldData['help_text'] ?? null,
                    'default_value' => $fieldData['default_value'] ?? null,
                    'options' => $fieldData['options'] ?? null,
                    'validation_rules' => $fieldData['validation_rules'] ?? null,
                    'required' => $fieldData['required'] ?? false,
                    'order' => $index,
                    'width' => $fieldData['width'] ?? 'full',
                ]);
            }
        }

        return redirect()->route('forms.index')->with('success', 'Form updated.');
    }

    public function destroy(Form $form)
    {
        $form->delete();

        return redirect()->route('forms.index')->with('success', 'Form deleted.');
    }

    public function submissions(Form $form)
    {
        $submissions = $form->submissions()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $form->load('fields');

        return Inertia::render('Forms/Submissions', [
            'form' => $form,
            'submissions' => $submissions,
        ]);
    }

    public function showPublic(string $slug)
    {
        $form = Form::where('slug', $slug)
            ->where('published', true)
            ->with('fields')
            ->firstOrFail();

        return Inertia::render('Forms/Show', [
            'form' => $form,
        ]);
    }

    public function submitPublic(Request $request, string $slug)
    {
        $form = Form::where('slug', $slug)
            ->where('published', true)
            ->with('fields')
            ->firstOrFail();

        // Build validation rules from form fields
        $rules = [];
        foreach ($form->fields as $field) {
            $fieldRules = [];
            if ($field->required) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            switch ($field->type) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'date':
                    $fieldRules[] = 'date';
                    break;
                case 'file':
                    $fieldRules[] = 'file';
                    $fieldRules[] = 'max:10240';
                    break;
                case 'checkbox':
                    $fieldRules = ['nullable'];
                    break;
            }

            $rules[$field->name] = $fieldRules;
        }

        $validated = $request->validate($rules);

        // Handle file uploads
        $data = [];
        foreach ($form->fields as $field) {
            if ($field->type === 'file' && $request->hasFile($field->name)) {
                $path = $request->file($field->name)->store('form-uploads', 'public');
                $data[$field->name] = $path;
            } else {
                $data[$field->name] = $validated[$field->name] ?? null;
            }
        }

        $form->submissions()->create([
            'data' => $data,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($form->redirect_url) {
            return Inertia::location($form->redirect_url);
        }

        return back()->with('success', $form->success_message ?? 'Form submitted successfully!');
    }
}
