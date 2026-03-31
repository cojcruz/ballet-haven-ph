import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

type FormField = {
    id: number;
    type: string;
    label: string;
    name: string;
    placeholder: string | null;
    help_text: string | null;
    default_value: string | null;
    options: { label: string; value: string }[] | null;
    repeater_fields: { label: string; name: string; type: string; auto_populate_from?: string; allowed_file_types?: string }[] | null;
    default_repeater_sets?: number | null;
    required: boolean;
    width: string;
    conditional_field: string | null;
    conditional_value: string | null;
    html_content: string | null;
    allowed_file_types: string | null;
    auto_populate_from: string | null;
};

type RepeaterEntry = Record<string, string | File | null>;

type FormType = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    submit_button_text: string;
    fields: FormField[];
};

type Props = {
    form: FormType;
};

export default function Show({ form: formData }: Props) {
    const pageProps = usePage().props as unknown as { flash?: { success?: string } };
    const flash = pageProps.flash || {};

    const initialData: Record<string, string | boolean | File | File[] | RepeaterEntry[] | null> = {};
    formData.fields.forEach((field) => {
        if (field.type === 'checkbox') {
            initialData[field.name] = false;
        } else if (field.type === 'multi_file') {
            initialData[field.name] = null;
        } else if (field.type === 'repeater') {
            initialData[field.name] = [];
        } else {
            initialData[field.name] = field.default_value || '';
        }
    });

    const [repeaterData, setRepeaterData] = useState<Record<string, RepeaterEntry[]>>(() => {
        const initial: Record<string, RepeaterEntry[]> = {};
        formData.fields.forEach((field) => {
            if (field.type === 'repeater') {
                const count = Math.min(50, Math.max(1, Number(field.default_repeater_sets || 1)));
                initial[field.name] = Array.from({ length: count }, () => ({}));
            }
        });
        return initial;
    });

    const addRepeaterEntry = (fieldName: string) => {
        setRepeaterData((prev) => ({
            ...prev,
            [fieldName]: [...(prev[fieldName] || []), {}],
        }));
    };

    const removeRepeaterEntry = (fieldName: string, index: number) => {
        setRepeaterData((prev) => ({
            ...prev,
            [fieldName]: prev[fieldName].filter((_, i) => i !== index),
        }));
    };

    const updateRepeaterEntry = (fieldName: string, index: number, subFieldName: string, value: string | File | null) => {
        setRepeaterData((prev) => {
            const entries = [...prev[fieldName]];
            entries[index] = { ...entries[index], [subFieldName]: value };
            return { ...prev, [fieldName]: entries };
        });
    };

    const { data, setData, post, processing, errors, reset, transform } = useForm(initialData);

    const toSafeName = (value: string) =>
        value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');

    const getRepeaterSubFieldKey = (
        subField: { label: string; name: string },
        subFieldIndex: number,
    ) => {
        const explicit = (subField.name || '').trim();
        if (explicit) {
            return explicit;
        }

        const fromLabel = toSafeName(subField.label || '');
        return fromLabel || `sub_field_${subFieldIndex + 1}`;
    };

    useEffect(() => {
        transform((current) => ({
            ...current,
            ...repeaterData,
        }));
    }, [repeaterData, transform]);

    // Auto-populate fields based on other field values
    useEffect(() => {
        formData.fields.forEach((field) => {
            if (field.auto_populate_from && data[field.auto_populate_from] !== undefined) {
                const sourceValue = data[field.auto_populate_from];
                // Only auto-populate if it's a string value and different from current
                if (typeof sourceValue === 'string' && data[field.name] !== sourceValue) {
                    setData(field.name, sourceValue);
                }
            }
        });

        // Auto-populate repeater sub-fields
        formData.fields.forEach((field) => {
            if (field.type === 'repeater' && field.repeater_fields) {
                const entries = repeaterData[field.name] || [];
                let hasChanges = false;
                const updatedEntries = entries.map((entry) => {
                    const newEntry = { ...entry };
                    field.repeater_fields?.forEach((subField, subIndex) => {
                        if (subField.auto_populate_from && data[subField.auto_populate_from] !== undefined) {
                            const sourceValue = data[subField.auto_populate_from];
                            const key = getRepeaterSubFieldKey(subField, subIndex);
                            if (typeof sourceValue === 'string' && newEntry[key] !== sourceValue) {
                                newEntry[key] = sourceValue;
                                hasChanges = true;
                            }
                        }
                    });
                    return newEntry;
                });
                if (hasChanges) {
                    setRepeaterData((prev) => ({ ...prev, [field.name]: updatedEntries }));
                }
            }
        });
    }, [data, formData.fields]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('forms.public.submit', formData.slug), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                // Reset repeater data
                const initialRepeater: Record<string, RepeaterEntry[]> = {};
                formData.fields.forEach((field) => {
                    if (field.type === 'repeater') {
                        const count = Math.min(50, Math.max(1, Number(field.default_repeater_sets || 1)));
                        initialRepeater[field.name] = Array.from({ length: count }, () => ({}));
                    }
                });
                setRepeaterData(initialRepeater);
            },
        });
    };

    const getWidthClass = (width: string) => {
        switch (width) {
            case 'half':
                return 'md:col-span-1';
            case 'third':
                return 'md:col-span-1';
            default:
                return 'md:col-span-2';
        }
    };

    const isFieldVisible = (field: FormField): boolean => {
        if (!field.conditional_field) {
            return true;
        }
        const conditionalValue = data[field.conditional_field];
        if (typeof conditionalValue === 'boolean') {
            return conditionalValue === (field.conditional_value === '1' || field.conditional_value === 'true');
        }
        return String(conditionalValue || '') === field.conditional_value;
    };

    const renderField = (field: FormField) => {
        const baseInputClass =
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

        const fieldType = (field.type || '').trim().toLowerCase();

        switch (fieldType) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                        placeholder={field.placeholder || undefined}
                        required={field.required}
                        rows={4}
                        className={baseInputClass}
                    />
                );

            case 'select':
                return (
                    <select
                        id={field.name}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                        required={field.required}
                        className={baseInputClass}
                    >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="mt-2 space-y-2">
                        {field.options?.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value}
                                    checked={data[field.name] === opt.value}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    required={field.required}
                                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="mt-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data[field.name] as boolean}
                                onChange={(e) => setData(field.name, e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{field.label}</span>
                        </label>
                    </div>
                );

            case 'file':
                return (
                    <input
                        type="file"
                        id={field.name}
                        accept={field.allowed_file_types || undefined}
                        onChange={(e) => setData(field.name, e.target.files?.[0] || null)}
                        required={field.required}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                );

            case 'multi_file':
                return (
                    <input
                        type="file"
                        id={field.name}
                        multiple
                        accept={field.allowed_file_types || undefined}
                        onChange={(e) => setData(field.name, e.target.files ? Array.from(e.target.files) : null)}
                        required={field.required}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                );

            case 'repeater':
                return (
                    <div className="mt-2 space-y-3">
                        {(repeaterData[field.name] || []).map((entry, entryIndex) => (
                            <div key={entryIndex} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-gray-500">Entry {entryIndex + 1}</span>
                                    {(repeaterData[field.name]?.length || 0) > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRepeaterEntry(field.name, entryIndex)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {field.repeater_fields?.map((subField, subIndex) => {
                                        const subType = (subField.type || '').trim().toLowerCase();
                                        const key = getRepeaterSubFieldKey(subField, subIndex);

                                        if (subType === 'hidden') {
                                            return (
                                                <input
                                                    key={key}
                                                    type="hidden"
                                                    value={(entry[key] as string) || ''}
                                                />
                                            );
                                        }

                                        return (
                                            <div key={key}>
                                                <label className="block text-xs font-medium text-gray-600">
                                                    {subField.label}
                                                </label>
                                                {subType === 'file' ? (
                                                    <input
                                                        type="file"
                                                        accept={subField.allowed_file_types || undefined}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] || null;
                                                            updateRepeaterEntry(field.name, entryIndex, key, file);
                                                        }}
                                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                    />
                                                ) : (
                                                    <input
                                                        type={subType}
                                                        value={(entry[key] as string) || ''}
                                                        onChange={(e) =>
                                                            updateRepeaterEntry(field.name, entryIndex, key, e.target.value)
                                                        }
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addRepeaterEntry(field.name)}
                            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus size={14} />
                            Add Entry
                        </button>
                    </div>
                );

            case 'hidden':
                return (
                    <input
                        type="hidden"
                        id={field.name}
                        value={data[field.name] as string}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        id={field.name}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                        required={field.required}
                        className={baseInputClass}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        id={field.name}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                        placeholder={field.placeholder || undefined}
                        required={field.required}
                        className={baseInputClass}
                    />
                );

            case 'email':
                return (
                    <input
                        type="email"
                        id={field.name}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                        placeholder={field.placeholder || undefined}
                        required={field.required}
                        className={baseInputClass}
                    />
                );

            case 'section':
                return (
                    <div className="border-b border-gray-200 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
                        {field.help_text && (
                            <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                        )}
                    </div>
                );

            case 'html':
                return (
                    <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: field.html_content || '' }}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        id={field.name}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                        placeholder={field.placeholder || undefined}
                        required={field.required}
                        className={baseInputClass}
                    />
                );
        }
    };

    return (
        <PublicLayout title={formData.title}>
        <div className="min-h-screen bg-gray-100 py-12">
            <Head title={formData.title} />

            <div className="mt-20 mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 md:p-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {formData.title}
                        </h1>
                        {formData.description && (
                            <p className="text-gray-600 mb-6">{formData.description}</p>
                        )}

                        {flash.success && (
                            <div className="mb-6 rounded-md bg-green-50 p-4">
                                <p className="text-sm text-green-800">{flash.success}</p>
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.fields.map((field) => {
                                    if (!isFieldVisible(field)) {
                                        return null;
                                    }

                                    const fieldType = (field.type || '').trim().toLowerCase();
                                    const wrapperClassName =
                                        getWidthClass(field.width) + (fieldType === 'hidden' ? ' hidden' : '');
                                    return (
                                        <div
                                            key={field.id}
                                            className={wrapperClassName}
                                        >
                                            {!['checkbox', 'hidden', 'section', 'html'].includes(fieldType) && (
                                                <label
                                                    htmlFor={field.name}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {field.label}
                                                    {field.required && (
                                                        <span className="text-red-500 ml-1">*</span>
                                                    )}
                                                </label>
                                            )}

                                            {renderField(field)}

                                            {field.help_text && !['section', 'html'].includes(fieldType) && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {field.help_text}
                                                </p>
                                            )}

                                            {errors[field.name] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors[field.name]}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : formData.submit_button_text}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> 
        </PublicLayout>
    );
}
