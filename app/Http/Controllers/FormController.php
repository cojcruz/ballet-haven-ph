<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormField;
use App\Models\FormSubmission;
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

        return Inertia::render('forms/Index', [
            'forms' => $forms,
        ]);
    }

    public function create()
    {
        return Inertia::render('forms/Create');
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
            'fields.*.conditional_field' => 'nullable|string',
            'fields.*.conditional_value' => 'nullable|string',
            'fields.*.repeater_fields' => 'nullable|array',
            'fields.*.default_repeater_sets' => 'nullable|integer|min:1|max:50',
            'fields.*.html_content' => 'nullable|string',
            'fields.*.allowed_file_types' => 'nullable|string',
            'fields.*.auto_populate_from' => 'nullable|string',
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
                    'conditional_field' => $fieldData['conditional_field'] ?? null,
                    'conditional_value' => $fieldData['conditional_value'] ?? null,
                    'repeater_fields' => $fieldData['repeater_fields'] ?? null,
                    'default_repeater_sets' => $fieldData['default_repeater_sets'] ?? 1,
                    'html_content' => $fieldData['html_content'] ?? null,
                    'allowed_file_types' => $fieldData['allowed_file_types'] ?? null,
                    'auto_populate_from' => $fieldData['auto_populate_from'] ?? null,
                ]);
            }
        }

        return redirect()->route('forms.index')->with('success', 'Form created.');
    }

    public function edit(Form $form)
    {
        $form->load('fields');

        return Inertia::render('forms/Edit', [
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
            'fields.*.conditional_field' => 'nullable|string',
            'fields.*.conditional_value' => 'nullable|string',
            'fields.*.repeater_fields' => 'nullable|array',
            'fields.*.default_repeater_sets' => 'nullable|integer|min:1|max:50',
            'fields.*.html_content' => 'nullable|string',
            'fields.*.allowed_file_types' => 'nullable|string',
            'fields.*.auto_populate_from' => 'nullable|string',
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
                    'conditional_field' => $fieldData['conditional_field'] ?? null,
                    'conditional_value' => $fieldData['conditional_value'] ?? null,
                    'repeater_fields' => $fieldData['repeater_fields'] ?? null,
                    'default_repeater_sets' => $fieldData['default_repeater_sets'] ?? 1,
                    'html_content' => $fieldData['html_content'] ?? null,
                    'allowed_file_types' => $fieldData['allowed_file_types'] ?? null,
                    'auto_populate_from' => $fieldData['auto_populate_from'] ?? null,
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

        return Inertia::render('forms/Submissions', [
            'form' => $form,
            'submissions' => $submissions,
        ]);
    }

    public function showSubmission(Form $form, FormSubmission $submission)
    {
        if ((int) $submission->form_id !== (int) $form->id) {
            abort(404);
        }

        $form->load('fields');

        return Inertia::render('forms/SubmissionShow', [
            'form' => $form,
            'submission' => $submission,
        ]);
    }

    public function exportSubmissions(Request $request, Form $form)
    {
        $format = strtolower(trim((string) $request->query('format', 'csv')));
        if (!in_array($format, ['csv', 'xls', 'html'], true)) {
            abort(400, 'Invalid export format.');
        }

        $form->load('fields');

        $submissions = $form->submissions()
            ->orderBy('created_at', 'desc')
            ->get(['id', 'data', 'ip_address', 'user_agent', 'created_at']);

        $toStorageHref = function (?string $path): string {
            $p = trim((string) $path);
            if ($p === '') {
                return '';
            }
            if (str_starts_with($p, 'http://') || str_starts_with($p, 'https://')) {
                return $p;
            }
            if (str_starts_with($p, '/storage/')) {
                return url($p);
            }
            return url('/storage/' . ltrim($p, '/'));
        };

        $valueToString = function ($value, FormField $field) use ($toStorageHref): string {
            if ($value === null) {
                return '';
            }
            if (is_bool($value)) {
                return $value ? 'Yes' : 'No';
            }

            if ($field->type === 'file') {
                if (is_string($value)) {
                    return $toStorageHref($value);
                }
                return '';
            }

            if ($field->type === 'multi_file') {
                if (is_array($value)) {
                    $links = [];
                    foreach ($value as $v) {
                        if (is_string($v)) {
                            $href = $toStorageHref($v);
                            if ($href !== '') {
                                $links[] = $href;
                            }
                        }
                    }
                    return implode("\n", $links);
                }
                return '';
            }

            if ($field->type === 'repeater') {
                if (!is_array($value) || count($value) === 0) {
                    return '';
                }

                $subFields = is_array($field->repeater_fields) ? $field->repeater_fields : [];
                $subFields = array_values(array_filter($subFields, function ($sf) {
                    return is_array($sf) && strtolower(trim((string) ($sf['type'] ?? ''))) !== 'hidden';
                }));

                $lines = [];
                foreach ($value as $rowIndex => $row) {
                    if (!is_array($row)) {
                        $lines[] = 'Entry ' . ((int) $rowIndex + 1) . ': ' . (string) $row;
                        continue;
                    }

                    $parts = [];
                    foreach ($subFields as $sf) {
                        $key = trim((string) ($sf['name'] ?? ''));
                        if ($key === '') {
                            continue;
                        }
                        $label = trim((string) ($sf['label'] ?? $key));
                        $subType = strtolower(trim((string) ($sf['type'] ?? 'text')));
                        $v = $row[$key] ?? null;

                        $sv = '';
                        if (is_bool($v)) {
                            $sv = $v ? 'Yes' : 'No';
                        } elseif ($subType === 'file') {
                            $sv = is_string($v) ? $toStorageHref($v) : '';
                        } elseif (is_array($v)) {
                            $sv = implode(', ', array_map(fn ($x) => is_scalar($x) ? (string) $x : json_encode($x), $v));
                        } elseif ($v === null) {
                            $sv = '';
                        } else {
                            $sv = is_scalar($v) ? (string) $v : json_encode($v);
                        }

                        $parts[] = $label . ': ' . $sv;
                    }

                    $lines[] = 'Entry ' . ((int) $rowIndex + 1) . (count($parts) ? ' - ' . implode(' | ', $parts) : '');
                }

                return implode("\n", $lines);
            }

            if (is_array($value)) {
                return implode(', ', array_map(fn ($x) => is_scalar($x) ? (string) $x : json_encode($x), $value));
            }

            if (is_scalar($value)) {
                return (string) $value;
            }

            return json_encode($value);
        };

        $headers = ['Date'];
        foreach ($form->fields as $field) {
            $headers[] = $field->label;
        }
        $headers[] = 'IP';
        $headers[] = 'User Agent';

        $rows = [];
        foreach ($submissions as $submission) {
            $row = [];
            $row[] = optional($submission->created_at)->toDateTimeString() ?? '';

            $data = is_array($submission->data) ? $submission->data : [];
            foreach ($form->fields as $field) {
                $row[] = $valueToString($data[$field->name] ?? null, $field);
            }

            $row[] = (string) ($submission->ip_address ?? '');
            $row[] = (string) ($submission->user_agent ?? '');

            $rows[] = $row;
        }

        $baseFilename = Str::slug($form->title) . '-submissions-' . now()->format('Ymd_His');

        if ($format === 'csv') {
            return response()->streamDownload(function () use ($headers, $rows) {
                $out = fopen('php://output', 'w');
                fputcsv($out, $headers);
                foreach ($rows as $row) {
                    fputcsv($out, $row);
                }
                fclose($out);
            }, $baseFilename . '.csv', [
                'Content-Type' => 'text/csv; charset=UTF-8',
            ]);
        }

        $escapeHtml = function (string $s): string {
            return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        };

        $html = '<!doctype html><html><head><meta charset="utf-8"><title>' . $escapeHtml($form->title) . ' Submissions</title>';
        $html .= '<style>body{font-family:ui-sans-serif,system-ui,Arial,sans-serif;font-size:12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:6px;vertical-align:top}th{background:#f5f5f5;text-align:left}td{white-space:pre-wrap}</style>';
        $html .= '</head><body>';
        $html .= '<h2>' . $escapeHtml($form->title) . ' - Submissions</h2>';
        $html .= '<p>Total: ' . count($rows) . '</p>';
        $html .= '<table><thead><tr>';
        foreach ($headers as $h) {
            $html .= '<th>' . $escapeHtml((string) $h) . '</th>';
        }
        $html .= '</tr></thead><tbody>';
        foreach ($rows as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= '<td>' . $escapeHtml((string) $cell) . '</td>';
            }
            $html .= '</tr>';
        }
        $html .= '</tbody></table>';
        $html .= '</body></html>';

        if ($format === 'xls') {
            return response($html, 200, [
                'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $baseFilename . '.xls"',
            ]);
        }

        return response($html, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $baseFilename . '.html"',
        ]);
    }

    public function showPublic(string $slug)
    {
        $form = Form::where('slug', $slug)
            ->where('published', true)
            ->with('fields')
            ->firstOrFail();

        return Inertia::render('forms/Show', [
            'form' => $form,
        ]);
    }

    public function export(Form $form)
    {
        $form->load('fields');
        
        $exportData = [
            'title' => $form->title,
            'description' => $form->description,
            'submit_button_text' => $form->submit_button_text,
            'success_message' => $form->success_message,
            'redirect_url' => $form->redirect_url,
            'send_email_notification' => $form->send_email_notification,
            'notification_email' => $form->notification_email,
            'fields' => $form->fields->map(function ($field) {
                return [
                    'type' => $field->type,
                    'label' => $field->label,
                    'name' => $field->name,
                    'placeholder' => $field->placeholder,
                    'help_text' => $field->help_text,
                    'default_value' => $field->default_value,
                    'options' => $field->options,
                    'repeater_fields' => $field->repeater_fields,
                    'default_repeater_sets' => $field->default_repeater_sets,
                    'required' => $field->required,
                    'width' => $field->width,
                    'conditional_field' => $field->conditional_field,
                    'conditional_value' => $field->conditional_value,
                    'html_content' => $field->html_content,
                ];
            })->toArray(),
        ];

        return response()->json($exportData)
            ->header('Content-Disposition', 'attachment; filename="' . Str::slug($form->title) . '-form.json"');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json|max:2048',
        ]);

        $content = file_get_contents($request->file('file')->getRealPath());
        $importData = json_decode($content, true);

        if (!$importData || !isset($importData['title']) || !isset($importData['fields'])) {
            return back()->with('error', 'Invalid form file format.');
        }

        $form = Form::create([
            'title' => $importData['title'] . ' (Imported)',
            'slug' => Str::slug($importData['title']) . '-' . Str::random(6),
            'description' => $importData['description'] ?? null,
            'submit_button_text' => $importData['submit_button_text'] ?? 'Submit',
            'success_message' => $importData['success_message'] ?? null,
            'redirect_url' => $importData['redirect_url'] ?? null,
            'send_email_notification' => $importData['send_email_notification'] ?? false,
            'notification_email' => $importData['notification_email'] ?? null,
            'published' => false,
        ]);

        foreach ($importData['fields'] as $index => $fieldData) {
            $form->fields()->create([
                'type' => $fieldData['type'],
                'label' => $fieldData['label'],
                'name' => $fieldData['name'],
                'placeholder' => $fieldData['placeholder'] ?? null,
                'help_text' => $fieldData['help_text'] ?? null,
                'default_value' => $fieldData['default_value'] ?? null,
                'options' => $fieldData['options'] ?? null,
                'repeater_fields' => $fieldData['repeater_fields'] ?? null,
                'default_repeater_sets' => $fieldData['default_repeater_sets'] ?? 1,
                'required' => $fieldData['required'] ?? false,
                'order' => $index,
                'width' => $fieldData['width'] ?? 'full',
                'conditional_field' => $fieldData['conditional_field'] ?? null,
                'conditional_value' => $fieldData['conditional_value'] ?? null,
                'html_content' => $fieldData['html_content'] ?? null,
            ]);
        }

        return redirect()->route('forms.edit', $form)->with('success', 'Form imported successfully!');
    }

    public function embed(string $slug)
    {
        $form = Form::where('slug', $slug)
            ->where('published', true)
            ->with('fields')
            ->firstOrFail();

        return Inertia::render('forms/Embed', [
            'form' => $form,
        ]);
    }

    public function submitPublic(Request $request, string $slug)
    {
        $form = Form::where('slug', $slug)
            ->where('published', true)
            ->with('fields')
            ->firstOrFail();

        $fileTypeRulesFromAccept = function (?string $accept): array {
            $accept = trim((string) $accept);
            if ($accept === '') {
                return [];
            }

            $parts = array_values(array_filter(array_map('trim', explode(',', $accept))));

            $exts = [];
            $mimetypes = [];
            foreach ($parts as $part) {
                if ($part === '') {
                    continue;
                }

                if (str_starts_with($part, '.')) {
                    $exts[] = strtolower(ltrim($part, '.'));
                    continue;
                }

                $lower = strtolower($part);

                if ($lower === 'image/*') {
                    $exts = array_merge($exts, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']);
                    continue;
                }
                if ($lower === 'video/*') {
                    $exts = array_merge($exts, ['mp4', 'mov', 'webm', 'avi', 'mkv']);
                    continue;
                }
                if ($lower === 'audio/*') {
                    $exts = array_merge($exts, ['mp3', 'wav', 'ogg', 'm4a']);
                    continue;
                }

                if ($lower === 'application/pdf') {
                    $exts[] = 'pdf';
                    continue;
                }
                if ($lower === 'image/jpeg') {
                    $exts = array_merge($exts, ['jpg', 'jpeg']);
                    continue;
                }
                if ($lower === 'image/png') {
                    $exts[] = 'png';
                    continue;
                }
                if ($lower === 'image/gif') {
                    $exts[] = 'gif';
                    continue;
                }
                if ($lower === 'image/webp') {
                    $exts[] = 'webp';
                    continue;
                }

                if (str_contains($lower, '/')) {
                    $mimetypes[] = $lower;
                    continue;
                }

                // Treat as extension if user entered "pdf" instead of ".pdf"
                if (preg_match('/^[a-z0-9]+$/', $lower)) {
                    $exts[] = $lower;
                }
            }

            $exts = array_values(array_unique(array_filter($exts)));
            if (count($exts) > 0) {
                return ['mimes:' . implode(',', $exts)];
            }

            $mimetypes = array_values(array_unique(array_filter($mimetypes)));
            if (count($mimetypes) > 0) {
                return ['mimetypes:' . implode(',', $mimetypes)];
            }

            return [];
        };

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
                case 'text':
                case 'textarea':
                case 'hidden':
                    $fieldRules[] = 'string';
                    break;
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'date':
                    $fieldRules[] = 'date';
                    break;
                case 'select':
                case 'radio':
                    $fieldRules[] = 'string';
                    if (is_array($field->options)) {
                        $values = array_values(array_filter(array_map(fn ($o) => $o['value'] ?? null, $field->options)));
                        if (count($values) > 0) {
                            $fieldRules[] = 'in:' . implode(',', $values);
                        }
                    }
                    break;
                case 'file':
                    $fieldRules[] = 'file';
                    $fieldRules[] = 'max:10240';
                    $fieldRules = array_merge($fieldRules, $fileTypeRulesFromAccept($field->allowed_file_types));
                    break;
                case 'multi_file':
                    $fieldRules = $field->required ? ['required', 'array'] : ['nullable', 'array'];
                    $rules[$field->name . '.*'] = array_merge(['file', 'max:10240'], $fileTypeRulesFromAccept($field->allowed_file_types));
                    break;
                case 'repeater':
                    $fieldRules = $field->required ? ['required', 'array'] : ['nullable', 'array'];
                    $rules[$field->name . '.*'] = ['array'];

                    $repeaterFields = is_array($field->repeater_fields) ? $field->repeater_fields : [];
                    foreach ($repeaterFields as $subIndex => $subField) {
                        if (!is_array($subField)) {
                            continue;
                        }

                        $subType = trim((string) ($subField['type'] ?? 'text'));
                        $subName = trim((string) ($subField['name'] ?? ''));
                        if ($subName === '') {
                            $label = trim((string) ($subField['label'] ?? ''));
                            $safe = strtolower($label);
                            $safe = preg_replace('/[^a-z0-9]+/', '_', $safe);
                            $safe = trim((string) $safe, '_');
                            $subName = $safe !== '' ? $safe : ('sub_field_' . ($subIndex + 1));
                        }

                        $subRules = ['nullable'];
                        switch ($subType) {
                            case 'email':
                                $subRules[] = 'email';
                                break;
                            case 'number':
                                $subRules[] = 'numeric';
                                break;
                            case 'date':
                                $subRules[] = 'date';
                                break;
                            case 'checkbox':
                                $subRules[] = 'boolean';
                                break;
                            case 'file':
                                $subRules[] = 'file';
                                $subRules[] = 'max:10240';
                                $subRules = array_merge($subRules, $fileTypeRulesFromAccept($subField['allowed_file_types'] ?? null));
                                break;
                            case 'multi_file':
                                $subRules = ['nullable', 'array'];
                                $rules[$field->name . '.*.' . $subName . '.*'] = array_merge(['file', 'max:10240'], $fileTypeRulesFromAccept($subField['allowed_file_types'] ?? null));
                                break;
                            default:
                                $subRules[] = 'string';
                                break;
                        }

                        $rules[$field->name . '.*.' . $subName] = $subRules;
                    }
                    break;
                case 'checkbox':
                    $fieldRules = ['nullable', 'boolean'];
                    break;
                default:
                    $fieldRules[] = 'string';
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
            } elseif ($field->type === 'multi_file' && $request->hasFile($field->name)) {
                $paths = [];
                foreach ($request->file($field->name) as $file) {
                    $paths[] = $file->store('form-uploads', 'public');
                }
                $data[$field->name] = $paths;
            } elseif ($field->type === 'repeater') {
                $entries = $request->input($field->name, []);
                if (!is_array($entries)) {
                    $entries = [];
                }

                $repeaterFiles = $request->file($field->name, []);
                if (is_array($repeaterFiles)) {
                    foreach ($repeaterFiles as $rowIndex => $rowFiles) {
                        if (!is_array($rowFiles)) {
                            continue;
                        }

                        if (!isset($entries[$rowIndex]) || !is_array($entries[$rowIndex])) {
                            $entries[$rowIndex] = [];
                        }

                        foreach ($rowFiles as $subKey => $fileOrFiles) {
                            if (is_array($fileOrFiles)) {
                                $paths = [];
                                foreach ($fileOrFiles as $file) {
                                    if ($file) {
                                        $paths[] = $file->store('form-uploads', 'public');
                                    }
                                }
                                $entries[$rowIndex][$subKey] = $paths;
                            } elseif ($fileOrFiles) {
                                $entries[$rowIndex][$subKey] = $fileOrFiles->store('form-uploads', 'public');
                            }
                        }
                    }
                }

                $data[$field->name] = $entries;
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
