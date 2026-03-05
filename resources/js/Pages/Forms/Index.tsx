import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Upload, Code, X } from 'lucide-react';

type Form = {
    id: number;
    title: string;
    slug: string;
    published: boolean;
    fields_count: number;
    submissions_count: number;
    created_at: string;
};

type Props = {
    forms: Form[];
};

export default function Index({ forms }: Props) {
    const [showImportModal, setShowImportModal] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState<Form | null>(null);
    const { data, setData, post, processing } = useForm<{ file: File | null }>({ file: null });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this form? All submissions will be lost.')) {
            router.delete(route('forms.destroy', id));
        }
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.file) {
            post(route('forms.import'), {
                forceFormData: true,
                onSuccess: () => {
                    setShowImportModal(false);
                    setData('file', null);
                },
            });
        }
    };

    const getEmbedCode = (form: Form) => {
        const url = `${window.location.origin}/form/${form.slug}/embed`;
        return `<iframe src="${url}" width="100%" height="600" frameborder="0" style="border: none;"></iframe>`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Forms
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            <Upload size={16} />
                            Import
                        </button>
                        <Link
                            href={route('forms.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Create Form
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Forms" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {forms.length === 0 ? (
                                <p className="text-gray-500">No forms yet. Create your first form!</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Fields
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Submissions
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {forms.map((form) => (
                                            <tr key={form.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {form.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            /form/{form.slug}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {form.fields_count} fields
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <Link
                                                        href={route('forms.submissions', form.id)}
                                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {form.submissions_count} submissions
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                            form.published
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {form.published ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    {form.published && (
                                                        <>
                                                            <a
                                                                href={`/form/${form.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-600 hover:text-gray-900 mr-3"
                                                            >
                                                                View
                                                            </a>
                                                            <button
                                                                onClick={() => setShowEmbedModal(form)}
                                                                className="text-purple-600 hover:text-purple-900 mr-3"
                                                                title="Get embed code"
                                                            >
                                                                <Code size={16} className="inline" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <a
                                                        href={route('forms.export', form.id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                        title="Export form"
                                                    >
                                                        <Download size={16} className="inline" />
                                                    </a>
                                                    <Link
                                                        href={route('forms.edit', form.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(form.id)}
                                                        className="ml-3 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Import Form</h3>
                            <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleImport}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select JSON file
                                </label>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowImportModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!data.file || processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Importing...' : 'Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Embed Modal */}
            {showEmbedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Embed Form: {showEmbedModal.title}</h3>
                            <button onClick={() => setShowEmbedModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Embed Code
                            </label>
                            <textarea
                                readOnly
                                value={getEmbedCode(showEmbedModal)}
                                rows={4}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono bg-gray-50"
                                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Copy and paste this code into your CMS page or HTML.
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Direct Link
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={`${window.location.origin}/form/${showEmbedModal.slug}/embed`}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono bg-gray-50"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(getEmbedCode(showEmbedModal));
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Copy Embed Code
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
