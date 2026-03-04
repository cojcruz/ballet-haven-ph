import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type FormField = {
    id: number;
    type: string;
    label: string;
    name: string;
    placeholder: string | null;
    help_text: string | null;
    default_value: string | null;
    options: { label: string; value: string }[] | null;
    repeater_fields: { label: string; name: string; type: string; auto_populate_from?: string }[] | null;
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

export default function Embed({ form: formData }: Props) {
    const pageProps = usePage().props as unknown as { flash?: { success?: string } };
    const flash = pageProps.flash || {};

    const initialData: Record<string, string | boolean | File | File[] | null> = {};
    formData.fields.forEach((field) => {
        if (field.type === 'checkbox') {
            initialData[field.name] = false;
        } else if (field.type === 'multi_file') {
            initialData[field.name] = null;
        } else {
            initialData[field.name] = field.default_value || '';
        }
    });

    const [repeaterData, setRepeaterData] = useState<Record<string, RepeaterEntry[]>>(() => {
        const initial: Record<string, RepeaterEntry[]> = {};
        formData.fields.forEach((field) => {
            if (field.type === 'repeater') {
                initial[field.name] = [{}];
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

    const { data, setData, post, processing, errors, reset } = useForm(initialData);

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
                    field.repeater_fields?.forEach((subField) => {
                        if (subField.auto_populate_from && data[subField.auto_populate_from] !== undefined) {
                            const sourceValue = data[subField.auto_populate_from];
                            if (typeof sourceValue === 'string' && newEntry[subField.name] !== sourceValue) {
                                newEntry[subField.name] = sourceValue;
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

        const formDataToSubmit = { ...data };
        Object.keys(repeaterData).forEach((key) => {
            formDataToSubmit[key] = repeaterData[key] as unknown as string;
        });

        Object.keys(formDataToSubmit).forEach((key) => {
            setData(key, formDataToSubmit[key]);
        });

        post(route('forms.public.submit', formData.slug), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                const initialRepeater: Record<string, RepeaterEntry[]> = {};
                formData.fields.forEach((field) => {
                    if (field.type === 'repeater') {
                        initialRepeater[field.name] = [{}];
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

    const baseInputClass =
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    const renderField = (field: FormField) => {
        switch (field.type) {
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
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="mt-2 space-y-2">
                        {field.options?.map((option) => (
                            <label key={option.value} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={option.value}
                                    checked={data[field.name] === option.value}
                                    onChange={(e) => setData(field.name, e.target.value)}
                                    required={field.required}
                                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <label className="flex items-center gap-2 mt-1">
                        <input
                            type="checkbox"
                            id={field.name}
                            checked={data[field.name] as boolean}
                            onChange={(e) => setData(field.name, e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{field.label}</span>
                    </label>
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
                                    {field.repeater_fields?.map((subField) => (
                                        <div key={subField.name}>
                                            <label className="block text-xs font-medium text-gray-600">
                                                {subField.label}
                                            </label>
                                            {subField.type === 'file' ? (
                                                <input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        updateRepeaterEntry(field.name, entryIndex, subField.name, file);
                                                    }}
                                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                            ) : (
                                                <input
                                                    type={subField.type}
                                                    value={(entry[subField.name] as string) || ''}
                                                    onChange={(e) => updateRepeaterEntry(field.name, entryIndex, subField.name, e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addRepeaterEntry(field.name)}
                            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus size={16} />
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
        <>
            <Head title={formData.title} />

            <div className="p-4">
                {flash.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">{flash.success}</p>
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.fields.map((field) => {
                            if (!isFieldVisible(field)) {
                                return null;
                            }
                            return (
                                <div
                                    key={field.id}
                                    className={`${getWidthClass(field.width)} ${
                                        field.type === 'hidden' ? 'hidden' : ''
                                    }`}
                                >
                                    {!['checkbox', 'hidden', 'section', 'html'].includes(field.type) && (
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

                                    {field.help_text && !['section', 'html'].includes(field.type) && (
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

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : formData.submit_button_text}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
