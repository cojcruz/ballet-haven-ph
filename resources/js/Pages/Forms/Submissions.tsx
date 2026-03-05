import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

type FormField = {
    id: number;
    name: string;
    label: string;
    type: string;
};

type Submission = {
    id: number;
    data: Record<string, string | boolean | null>;
    ip_address: string | null;
    is_read: boolean;
    created_at: string;
};

type Form = {
    id: number;
    title: string;
    slug: string;
    fields: FormField[];
};

type Props = {
    form: Form;
    submissions: {
        data: Submission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Submissions({ form, submissions }: Props) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatValue = (value: string | boolean | null, fieldType: string) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (fieldType === 'file' && typeof value === 'string') {
            return (
                <a
                    href={`/storage/${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    View File
                </a>
            );
        }
        return String(value);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Submissions: {form.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {submissions.total} total submissions
                        </p>
                    </div>
                    <Link
                        href={route('forms.edit', form.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        ← Back to Form
                    </Link>
                </div>
            }
        >
            <Head title={`Submissions: ${form.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {submissions.data.length === 0 ? (
                                <p className="text-gray-500">No submissions yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Date
                                                </th>
                                                {form.fields.map((field) => (
                                                    <th
                                                        key={field.id}
                                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                    >
                                                        {field.label}
                                                    </th>
                                                ))}
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    IP
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {submissions.data.map((submission) => (
                                                <tr key={submission.id}>
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                        {formatDate(submission.created_at)}
                                                    </td>
                                                    {form.fields.map((field) => (
                                                        <td
                                                            key={field.id}
                                                            className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"
                                                        >
                                                            {formatValue(submission.data[field.name], field.type)}
                                                        </td>
                                                    ))}
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                        {submission.ip_address || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {submissions.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Showing {(submissions.current_page - 1) * submissions.per_page + 1} to{' '}
                                        {Math.min(submissions.current_page * submissions.per_page, submissions.total)} of{' '}
                                        {submissions.total} results
                                    </p>
                                    <div className="flex gap-2">
                                        {Array.from({ length: submissions.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={route('forms.submissions', { form: form.id, page })}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    page === submissions.current_page
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
