import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type FormField = {
    id: number;
    type: string;
    label: string;
    name: string;
    placeholder: string | null;
    help_text: string | null;
    default_value: string | null;
    options: { label: string; value: string }[] | null;
    required: boolean;
    width: string;
};

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

    const initialData: Record<string, string | boolean | File | null> = {};
    formData.fields.forEach((field) => {
        if (field.type === 'checkbox') {
            initialData[field.name] = false;
        } else {
            initialData[field.name] = field.default_value || '';
        }
    });

    const { data, setData, post, processing, errors, reset } = useForm(initialData);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('forms.public.submit', formData.slug), {
            forceFormData: true,
            onSuccess: () => reset(),
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

    const renderField = (field: FormField) => {
        const baseInputClass =
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

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
                        onChange={(e) => setData(field.name, e.target.files?.[0] || null)}
                        required={field.required}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
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
        <div className="min-h-screen bg-gray-100 py-12">
            <Head title={formData.title} />

            <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
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
                                {formData.fields.map((field) => (
                                    <div
                                        key={field.id}
                                        className={`${getWidthClass(field.width)} ${
                                            field.type === 'hidden' ? 'hidden' : ''
                                        }`}
                                    >
                                        {field.type !== 'checkbox' && field.type !== 'hidden' && (
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

                                        {field.help_text && (
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
                                ))}
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
    );
}
