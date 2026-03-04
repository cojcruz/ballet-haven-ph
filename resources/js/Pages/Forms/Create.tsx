import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy } from 'lucide-react';

type FormField = {
    type: string;
    label: string;
    name: string;
    placeholder: string;
    help_text: string;
    default_value: string;
    options: { label: string; value: string }[];
    repeater_fields: { label: string; name: string; type: string; auto_populate_from?: string }[];
    required: boolean;
    width: string;
    conditional_field: string;
    conditional_value: string;
    html_content: string;
    allowed_file_types: string;
    auto_populate_from: string;
};

const FILE_TYPE_OPTIONS = [
    { value: '', label: 'All Files' },
    { value: 'image/*', label: 'Images Only (jpg, png, gif, etc.)' },
    { value: '.pdf', label: 'PDF Only' },
    { value: '.pdf,.doc,.docx', label: 'Documents (PDF, Word)' },
    { value: 'image/*,.pdf', label: 'Images & PDF' },
    { value: '.xls,.xlsx,.csv', label: 'Spreadsheets (Excel, CSV)' },
    { value: 'video/*', label: 'Videos Only' },
    { value: 'audio/*', label: 'Audio Only' },
];

const CONDITIONAL_OPERATORS = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_empty', label: 'Is Not Empty' },
];

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'tel', label: 'Phone Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
    { value: 'multi_file', label: 'Multi-File' },
    { value: 'repeater', label: 'Repeater' },
    { value: 'section', label: 'Section' },
    { value: 'html', label: 'Custom HTML' },
    { value: 'hidden', label: 'Hidden' },
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'full_name', label: 'Full Name' },
    { value: 'address', label: 'Address' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State/Province' },
    { value: 'zip', label: 'ZIP/Postal Code' },
    { value: 'country', label: 'Country' },
];

const REPEATER_FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'tel', label: 'Phone Number' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File Upload' },
    { value: 'select', label: 'Dropdown' },
    { value: 'hidden', label: 'Hidden' },
];

const WIDTH_OPTIONS = [
    { value: 'full', label: 'Full Width' },
    { value: 'half', label: 'Half Width' },
    { value: 'third', label: 'One Third' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        description: '',
        submit_button_text: 'Submit',
        success_message: 'Thank you for your submission!',
        redirect_url: '',
        send_email_notification: false,
        notification_email: '',
        published: false,
        fields: [] as FormField[],
    });

    const [expandedField, setExpandedField] = useState<number | null>(null);

    const addField = (type: string) => {
        const newField: FormField = {
            type,
            label: '',
            name: '',
            placeholder: '',
            help_text: '',
            default_value: '',
            options: [],
            repeater_fields: [],
            required: false,
            width: 'full',
            conditional_field: '',
            conditional_value: '',
            html_content: '',
            allowed_file_types: '',
            auto_populate_from: '',
        };
        setData('fields', [...data.fields, newField]);
        setExpandedField(data.fields.length);
    };

    const updateField = (index: number, updates: Partial<FormField>) => {
        const newFields = [...data.fields];
        newFields[index] = { ...newFields[index], ...updates };
        
        // Auto-generate name from label
        if (updates.label !== undefined) {
            newFields[index].name = updates.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '');
        }
        
        setData('fields', newFields);
    };

    const removeField = (index: number) => {
        const newFields = data.fields.filter((_, i) => i !== index);
        setData('fields', newFields);
        setExpandedField(null);
    };

    const duplicateField = (index: number) => {
        const fieldToDuplicate = data.fields[index];
        const duplicatedField: FormField = {
            ...fieldToDuplicate,
            label: `${fieldToDuplicate.label} (Copy)`,
            name: `${fieldToDuplicate.name}_copy`,
            options: [...fieldToDuplicate.options],
            repeater_fields: [...fieldToDuplicate.repeater_fields],
        };
        const newFields = [...data.fields];
        newFields.splice(index + 1, 0, duplicatedField);
        setData('fields', newFields);
        setExpandedField(index + 1);
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        const newFields = [...data.fields];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newFields.length) return;
        [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
        setData('fields', newFields);
        setExpandedField(newIndex);
    };

    const addOption = (fieldIndex: number) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].options = [
            ...newFields[fieldIndex].options,
            { label: '', value: '' },
        ];
        setData('fields', newFields);
    };

    const updateOption = (fieldIndex: number, optionIndex: number, updates: { label?: string; value?: string }) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].options[optionIndex] = {
            ...newFields[fieldIndex].options[optionIndex],
            ...updates,
        };
        // Auto-generate value from label only if value is empty
        if (updates.label !== undefined && !newFields[fieldIndex].options[optionIndex].value) {
            newFields[fieldIndex].options[optionIndex].value = updates.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_');
        }
        setData('fields', newFields);
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
        setData('fields', newFields);
    };

    const addRepeaterField = (fieldIndex: number) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].repeater_fields = [
            ...newFields[fieldIndex].repeater_fields,
            { label: '', name: '', type: 'text' },
        ];
        setData('fields', newFields);
    };

    const updateRepeaterField = (fieldIndex: number, subFieldIndex: number, updates: { label?: string; name?: string; type?: string; auto_populate_from?: string }) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].repeater_fields[subFieldIndex] = {
            ...newFields[fieldIndex].repeater_fields[subFieldIndex],
            ...updates,
        };
        if (updates.label !== undefined) {
            newFields[fieldIndex].repeater_fields[subFieldIndex].name = updates.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '');
        }
        setData('fields', newFields);
    };

    const removeRepeaterField = (fieldIndex: number, subFieldIndex: number) => {
        const newFields = [...data.fields];
        newFields[fieldIndex].repeater_fields = newFields[fieldIndex].repeater_fields.filter((_, i) => i !== subFieldIndex);
        setData('fields', newFields);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('forms.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Form
                </h2>
            }
        >
            <Head title="Create Form" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Form Settings */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6 space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Form Settings</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Form Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        URL Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Submit Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={data.submit_button_text}
                                        onChange={(e) => setData('submit_button_text', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Redirect URL (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.redirect_url}
                                        onChange={(e) => setData('redirect_url', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Success Message
                                </label>
                                <textarea
                                    value={data.success_message}
                                    onChange={(e) => setData('success_message', e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.send_email_notification}
                                        onChange={(e) => setData('send_email_notification', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Send email notification</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.published}
                                        onChange={(e) => setData('published', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Published</span>
                                </label>
                            </div>

                            {data.send_email_notification && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Notification Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.notification_email}
                                        onChange={(e) => setData('notification_email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 ">Form Fields</h3>
                                <div className="gap-2">
                                    {FIELD_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => addField(type.value)}
                                            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 m-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                        >
                                            <Plus size={12} />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {data.fields.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500">No fields yet. Click a field type above to add one.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.fields.map((field, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <div
                                                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                                                onClick={() => setExpandedField(expandedField === index ? null : index)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <GripVertical size={16} className="text-gray-400" />
                                                    <span className="text-xs font-medium text-gray-500 uppercase bg-gray-200 px-2 py-0.5 rounded">
                                                        {field.type}
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {field.label || 'Untitled Field'}
                                                    </span>
                                                    {field.required && (
                                                        <span className="text-red-500 text-sm">*</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); moveField(index, 'up'); }}
                                                        disabled={index === 0}
                                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                    >
                                                        <ChevronUp size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); moveField(index, 'down'); }}
                                                        disabled={index === data.fields.length - 1}
                                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                    >
                                                        <ChevronDown size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); duplicateField(index); }}
                                                        className="p-1 text-blue-400 hover:text-blue-600"
                                                        title="Duplicate field"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeField(index); }}
                                                        className="p-1 text-red-400 hover:text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedField === index && (
                                                <div className="p-4 space-y-4 border-t border-gray-200">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Label *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={field.label}
                                                                onChange={(e) => updateField(index, { label: e.target.value })}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Field Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={field.name}
                                                                onChange={(e) => updateField(index, { name: e.target.value })}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-gray-50"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    {['text', 'email', 'number', 'textarea'].includes(field.type) && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Placeholder
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={field.placeholder}
                                                                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Help Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.help_text}
                                                            onChange={(e) => updateField(index, { help_text: e.target.value })}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                        />
                                                    </div>

                                                    {!['section', 'html', 'repeater'].includes(field.type) && (
                                                        <div className="space-y-2">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!field.auto_populate_from}
                                                                    onChange={(e) => updateField(index, { auto_populate_from: e.target.checked ? '_pending' : '' })}
                                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <span className="text-sm text-gray-700">Auto-populate from another field</span>
                                                            </label>
                                                            {field.auto_populate_from && (
                                                                <select
                                                                    value={field.auto_populate_from === '_pending' ? '' : field.auto_populate_from}
                                                                    onChange={(e) => updateField(index, { auto_populate_from: e.target.value || '_pending' })}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                >
                                                                    <option value="">Select a field...</option>
                                                                    {data.fields
                                                                        .filter((f, i) => i !== index && !['section', 'html', 'repeater'].includes(f.type))
                                                                        .map((f) => (
                                                                            <option key={f.name} value={f.name}>
                                                                                {f.label || f.name || '(unnamed)'}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Options
                                                            </label>
                                                            <div className="space-y-2">
                                                                {field.options.map((option, optIndex) => (
                                                                    <div key={optIndex} className="flex items-center gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={option.label}
                                                                            onChange={(e) => updateOption(index, optIndex, { label: e.target.value })}
                                                                            placeholder="Label"
                                                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={option.value}
                                                                            onChange={(e) => updateOption(index, optIndex, { value: e.target.value })}
                                                                            placeholder="Value"
                                                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeOption(index, optIndex)}
                                                                            className="p-1 text-red-400 hover:text-red-600"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addOption(index)}
                                                                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                                                                >
                                                                    <Plus size={14} />
                                                                    Add Option
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {field.type === 'repeater' && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Repeater Sub-Fields
                                                            </label>
                                                            <p className="text-xs text-gray-500 mb-2">
                                                                Define the fields that will repeat for each entry.
                                                            </p>
                                                            <div className="space-y-2">
                                                                {field.repeater_fields.map((subField, subIndex) => (
                                                                    <div key={subIndex} className="p-2 bg-gray-50 rounded space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="text"
                                                                                value={subField.label}
                                                                                onChange={(e) => updateRepeaterField(index, subIndex, { label: e.target.value })}
                                                                                placeholder="Field label"
                                                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                            />
                                                                            <select
                                                                                value={subField.type}
                                                                                onChange={(e) => updateRepeaterField(index, subIndex, { type: e.target.value })}
                                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                            >
                                                                                {REPEATER_FIELD_TYPES.map((t) => (
                                                                                    <option key={t.value} value={t.value}>
                                                                                        {t.label}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeRepeaterField(index, subIndex)}
                                                                                className="p-1 text-red-400 hover:text-red-600"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={!!subField.auto_populate_from}
                                                                                    onChange={(e) => updateRepeaterField(index, subIndex, { auto_populate_from: e.target.checked ? '_pending' : '' })}
                                                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                                />
                                                                                <span className="text-xs text-gray-500">Auto-populate</span>
                                                                            </label>
                                                                            {subField.auto_populate_from && (
                                                                                <select
                                                                                    value={subField.auto_populate_from === '_pending' ? '' : subField.auto_populate_from}
                                                                                    onChange={(e) => updateRepeaterField(index, subIndex, { auto_populate_from: e.target.value || '_pending' })}
                                                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                                                                                >
                                                                                    <option value="">Select a field...</option>
                                                                                    {data.fields
                                                                                        .filter((f) => !['section', 'html', 'repeater'].includes(f.type))
                                                                                        .map((f) => (
                                                                                            <option key={f.name} value={f.name}>
                                                                                                {f.label || f.name || '(unnamed)'}
                                                                                            </option>
                                                                                        ))}
                                                                                </select>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addRepeaterField(index)}
                                                                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                                                                >
                                                                    <Plus size={14} />
                                                                    Add Sub-Field
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(field.type === 'file' || field.type === 'multi_file') && (
                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Allowed File Types
                                                                </label>
                                                                <select
                                                                    value={field.allowed_file_types}
                                                                    onChange={(e) => updateField(index, { allowed_file_types: e.target.value })}
                                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    {FILE_TYPE_OPTIONS.map((opt) => (
                                                                        <option key={opt.value} value={opt.value}>
                                                                            {opt.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Or Custom File Types
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={field.allowed_file_types}
                                                                    onChange={(e) => updateField(index, { allowed_file_types: e.target.value })}
                                                                    placeholder="e.g., .jpg,.png,.pdf or image/*"
                                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Use comma-separated extensions (.pdf,.docx) or MIME types (image/*, video/*)
                                                                </p>
                                                            </div>
                                                            {field.type === 'multi_file' && (
                                                                <div className="p-3 bg-blue-50 rounded-md">
                                                                    <p className="text-sm text-blue-700">
                                                                        This field allows users to upload multiple files at once.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {field.type === 'section' && (
                                                        <div className="p-3 bg-purple-50 rounded-md">
                                                            <p className="text-sm text-purple-700">
                                                                This creates a section header to organize your form. The label will be displayed as a heading.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {field.type === 'html' && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                HTML Content
                                                            </label>
                                                            <textarea
                                                                value={field.html_content}
                                                                onChange={(e) => updateField(index, { html_content: e.target.value })}
                                                                rows={6}
                                                                placeholder="<p>Your custom HTML here...</p>"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono"
                                                            />
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Enter raw HTML. Be careful with scripts and styles.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Conditional Visibility */}
                                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Conditional Visibility
                                                        </label>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            Show this field only when another field has a specific value.
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <select
                                                                value={field.conditional_field}
                                                                onChange={(e) => {
                                                                    updateField(index, { conditional_field: e.target.value, conditional_value: '' });
                                                                }}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            >
                                                                <option value="">Always visible</option>
                                                                {data.fields
                                                                    .filter((_, i) => i !== index)
                                                                    .filter((f) => ['select', 'radio', 'checkbox'].includes(f.type) && f.options.length > 0)
                                                                    .map((f) => (
                                                                        <option key={f.name} value={f.name}>
                                                                            {f.label || f.name || '(unnamed field)'}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                            {field.conditional_field && (() => {
                                                                const targetField = data.fields.find((f) => f.name === field.conditional_field);
                                                                if (targetField && targetField.options.length > 0) {
                                                                    return (
                                                                        <select
                                                                            value={field.conditional_value}
                                                                            onChange={(e) => updateField(index, { conditional_value: e.target.value })}
                                                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                        >
                                                                            <option value="">Select value...</option>
                                                                            {targetField.options.map((opt) => (
                                                                                <option key={opt.value} value={opt.value}>
                                                                                    {opt.label}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => updateField(index, { required: e.target.checked })}
                                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-sm text-gray-700">Required</span>
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-700">Width:</span>
                                                            <select
                                                                value={field.width}
                                                                onChange={(e) => updateField(index, { width: e.target.value })}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            >
                                                                {WIDTH_OPTIONS.map((opt) => (
                                                                    <option key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href={route('forms.index')}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Create Form
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
