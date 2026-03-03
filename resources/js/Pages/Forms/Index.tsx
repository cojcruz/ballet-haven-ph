import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

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
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this form? All submissions will be lost.')) {
            router.delete(route('forms.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Forms
                    </h2>
                    <Link
                        href={route('forms.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Create Form
                    </Link>
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
                                                        <a
                                                            href={`/form/${form.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-gray-900 mr-4"
                                                        >
                                                            View
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={route('forms.edit', form.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(form.id)}
                                                        className="ml-4 text-red-600 hover:text-red-900"
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
        </AuthenticatedLayout>
    );
}
