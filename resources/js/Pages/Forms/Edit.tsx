import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

type FormFieldType = {
    id?: number;
    type: string;
    label: string;
    name: string;
    placeholder: string;
    help_text: string;
    default_value: string;
    options: { label: string; value: string }[];
    required: boolean;
    width: string;
};

type FormType = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    submit_button_text: string;
    success_message: string | null;
    redirect_url: string | null;
    send_email_notification: boolean;
    notification_email: string | null;
    published: boolean;
    fields: FormFieldType[];
};

type Props = {
    form: FormType;
};

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
    { value: 'hidden', label: 'Hidden' },
];

const WIDTH_OPTIONS = [
    { value: 'full', label: 'Full Width' },
    { value: 'half', label: 'Half Width' },
    { value: 'third', label: 'One Third' },
];

export default function Edit({ form: initialForm }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: initialForm.title,
        slug: initialForm.slug,
        description: initialForm.description || '',
        submit_button_text: initialForm.submit_button_text,
        success_message: initialForm.success_message || '',
        redirect_url: initialForm.redirect_url || '',
        send_email_notification: initialForm.send_email_notification,
        notification_email: initialForm.notification_email || '',
        published: initialForm.published,
        fields: initialForm.fields.map((f) => ({
            type: f.type,
            label: f.label,
            name: f.name,
            placeholder: f.placeholder || '',
            help_text: f.help_text || '',
            default_value: f.default_value || '',
            options: f.options || [],
            required: f.required,
            width: f.width,
        })) as FormFieldType[],
    });

    const [expandedField, setExpandedField] = useState<number | null>(null);

    const addField = (type: string) => {
        const newField: FormFieldType = {
            type,
            label: '',
            name: '',
            placeholder: '',
            help_text: '',
            default_value: '',
            options: [],
            required: false,
            width: 'full',
        };
        setData('fields', [...data.fields, newField]);
        setExpandedField(data.fields.length);
    };

    const updateField = (index: number, updates: Partial<FormFieldType>) => {
        const newFields = [...data.fields];
        newFields[index] = { ...newFields[index], ...updates };
        
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
        if (updates.label !== undefined) {
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('forms.update', initialForm.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Form: {initialForm.title}
                </h2>
            }
        >
            <Head title={`Edit Form: ${initialForm.title}`} />

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
                                <h3 className="text-lg font-medium text-gray-900">Form Fields</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {FIELD_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => addField(type.value)}
                                            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
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
                                                                            placeholder="Option label"
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
                                Update Form
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
