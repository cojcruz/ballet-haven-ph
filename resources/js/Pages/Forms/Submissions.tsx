import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type FormField = {
    id: number;
    name: string;
    label: string;
    type: string;
    repeater_fields?: { label: string; name: string; type: string }[] | null;
};

type Submission = {
    id: number;
    data: Record<string, unknown>;
    ip_address: string | null;
    user_agent?: string | null;
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
    const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
    const [copyStatus, setCopyStatus] = useState<string>('');

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const toStorageHref = (path: string) => {
        const origin = globalThis.location?.origin || '';
        const p = path.trim();
        if (p === '') return '';
        if (p.startsWith('http://') || p.startsWith('https://')) return p;
        if (p.startsWith('/storage/')) return origin ? `${origin}${p}` : p;
        const rel = `/storage/${p.replace(/^\/+/, '')}`;
        return origin ? `${origin}${rel}` : rel;
    };

    const getFileLabel = (path: string, fallback: string) => {
        const clean = path.split('?')[0].split('#')[0];
        const last = clean.split('/').filter(Boolean).pop();
        return last || fallback;
    };

    const isRecord = (v: unknown): v is Record<string, unknown> => {
        return typeof v === 'object' && v !== null && !Array.isArray(v);
    };

    const renderFileLink = (value: unknown, fallbackLabel: string) => {
        if (typeof value !== 'string') return '-';
        const href = toStorageHref(value);
        if (!href) return '-';
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-900"
            >
                {getFileLabel(value, fallbackLabel)}
            </a>
        );
    };

    const formatValue = (value: unknown, field: FormField) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';

        if (field.type === 'file') {
            return renderFileLink(value, 'View File');
        }

        if (field.type === 'multi_file') {
            if (!Array.isArray(value) || value.length === 0) return '-';
            return (
                <div className="space-y-1">
                    {value.map((v, idx) => (
                        <div key={idx}>{renderFileLink(v, `File ${idx + 1}`)}</div>
                    ))}
                </div>
            );
        }

        if (field.type === 'repeater') {
            if (!Array.isArray(value) || value.length === 0) return '-';

            const subFields = (field.repeater_fields || []).filter((sf) => (sf?.type || '').trim().toLowerCase() !== 'hidden');

            return (
                <div className="space-y-2">
                    {value.map((row, rowIndex) => {
                        if (!isRecord(row)) {
                            return (
                                <div key={rowIndex} className="text-gray-700">
                                    Entry {rowIndex + 1}: {String(row)}
                                </div>
                            );
                        }

                        return (
                            <div key={rowIndex} className="rounded border border-gray-200 bg-gray-50 p-2">
                                <div className="text-xs font-medium text-gray-500 mb-1">Entry {rowIndex + 1}</div>
                                <div className="space-y-1">
                                    {subFields.map((sf, sfIndex) => {
                                        const key = (sf.name || '').trim();
                                        const subType = (sf.type || '').trim().toLowerCase();
                                        if (!key) return null;
                                        const v = row[key];

                                        return (
                                            <div key={sfIndex} className="text-sm text-gray-900">
                                                <span className="text-xs font-medium text-gray-600">{sf.label}:</span>{' '}
                                                {subType === 'file' ? (
                                                    renderFileLink(v, 'View File')
                                                ) : Array.isArray(v) ? (
                                                    v.join(', ')
                                                ) : typeof v === 'boolean' ? (
                                                    v ? 'Yes' : 'No'
                                                ) : v === null || v === undefined ? (
                                                    '-'
                                                ) : (
                                                    String(v)
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (Array.isArray(value)) {
            return value.join(', ');
        }

        if (isRecord(value)) {
            return JSON.stringify(value);
        }

        return String(value);
    };

    const stringifyForExport = (value: unknown, field: FormField): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';

        if (field.type === 'file') {
            if (typeof value !== 'string') return '';
            return toStorageHref(value);
        }

        if (field.type === 'multi_file') {
            if (!Array.isArray(value)) return '';
            return value
                .map((v) => (typeof v === 'string' ? toStorageHref(v) : ''))
                .filter(Boolean)
                .join('\n');
        }

        if (field.type === 'repeater') {
            if (!Array.isArray(value)) return '';
            const subFields = (field.repeater_fields || []).filter((sf) => (sf?.type || '').trim().toLowerCase() !== 'hidden');

            return value
                .map((row, idx) => {
                    if (!isRecord(row)) {
                        return `Entry ${idx + 1}: ${String(row)}`;
                    }
                    const parts = subFields
                        .map((sf) => {
                            const key = (sf.name || '').trim();
                            if (!key) return '';
                            const label = sf.label || key;
                            const subType = (sf.type || '').trim().toLowerCase();
                            const v = row[key];
                            let sv = '';
                            if (subType === 'file') {
                                sv = typeof v === 'string' ? toStorageHref(v) : '';
                            } else if (Array.isArray(v)) {
                                sv = v.map((x) => (x === null || x === undefined ? '' : String(x))).join(', ');
                            } else if (typeof v === 'boolean') {
                                sv = v ? 'Yes' : 'No';
                            } else if (v === null || v === undefined) {
                                sv = '';
                            } else {
                                sv = String(v);
                            }
                            return `${label}: ${sv}`;
                        })
                        .filter(Boolean);
                    return `Entry ${idx + 1}${parts.length ? ' - ' + parts.join(' | ') : ''}`;
                })
                .join('\n');
        }

        if (Array.isArray(value)) {
            return value.map((x) => (x === null || x === undefined ? '' : String(x))).join(', ');
        }

        if (isRecord(value)) {
            return JSON.stringify(value);
        }

        return String(value);
    };

    const copyToClipboard = async () => {
        try {
            const headers = ['Date', ...form.fields.map((f) => f.label), 'IP', 'User Agent'];
            const lines: string[] = [];
            lines.push(headers.join('\t'));

            for (const s of submissions.data) {
                const row: string[] = [];
                row.push(formatDate(s.created_at));
                for (const f of form.fields) {
                    row.push(stringifyForExport(s.data[f.name], f));
                }
                row.push(s.ip_address || '');
                row.push(s.user_agent || '');
                lines.push(row.join('\t'));
            }

            await navigator.clipboard.writeText(lines.join('\n'));
            setCopyStatus('Copied');
            window.setTimeout(() => setCopyStatus(''), 1500);
        } catch {
            setCopyStatus('Copy failed');
            window.setTimeout(() => setCopyStatus(''), 2000);
        }
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
                    <div className="flex items-center gap-3">
                        <a
                            href={route('forms.submissions.export', { form: form.id, format: 'csv' })}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            Export CSV
                        </a>
                        <a
                            href={route('forms.submissions.export', { form: form.id, format: 'xls' })}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            Export XLS
                        </a>
                        <a
                            href={route('forms.submissions.export', { form: form.id, format: 'html' })}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            Export HTML
                        </a>
                        <button
                            type="button"
                            onClick={copyToClipboard}
                            className="text-sm text-gray-700 hover:text-gray-900"
                        >
                            Copy
                        </button>
                        {copyStatus && (
                            <span className="text-xs text-gray-500">{copyStatus}</span>
                        )}
                        <Link
                            href={route('forms.edit', form.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            ← Back to Form
                        </Link>
                    </div>
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
                                                    View
                                                </th>
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
                                                            className={`px-4 py-3 text-sm text-gray-900 max-w-xs align-top ${
                                                                field.type === 'repeater' || field.type === 'multi_file' ? 'whitespace-normal' : 'truncate'
                                                            }`}
                                                        >
                                                            {formatValue(submission.data[field.name], field)}
                                                        </td>
                                                    ))}
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveSubmission(submission)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Quick View
                                                            </button>
                                                            <Link
                                                                href={route('forms.submissions.show', {
                                                                    form: form.id,
                                                                    submission: submission.id,
                                                                })}
                                                                className="text-gray-600 hover:text-gray-900"
                                                            >
                                                                Open
                                                            </Link>
                                                        </div>
                                                    </td>
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

            {activeSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setActiveSubmission(null)}
                    />
                    <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
                        <div className="flex items-start justify-between p-4 border-b border-gray-200">
                            <div>
                                <div className="text-lg font-semibold text-gray-800">Submission #{activeSubmission.id}</div>
                                <div className="text-sm text-gray-500">{formatDate(activeSubmission.created_at)}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveSubmission(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-4 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="rounded-md border border-gray-200 p-3">
                                    <div className="text-xs font-medium text-gray-500">IP Address</div>
                                    <div className="text-sm text-gray-900">{activeSubmission.ip_address || '-'}</div>
                                </div>
                                {activeSubmission.user_agent !== undefined && (
                                    <div className="rounded-md border border-gray-200 p-3">
                                        <div className="text-xs font-medium text-gray-500">User Agent</div>
                                        <div className="text-sm text-gray-900 break-words">
                                            {activeSubmission.user_agent || '-'}
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-md border border-gray-200">
                                    <div className="p-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                                        Submitted Data
                                    </div>
                                    <div className="p-3 space-y-4">
                                        {form.fields.map((field) => (
                                            <div key={field.id}>
                                                <div className="text-xs font-medium text-gray-600">{field.label}</div>
                                                <div className="mt-1 text-sm text-gray-900 whitespace-normal">
                                                    {formatValue(activeSubmission.data[field.name], field)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                            <Link
                                href={route('forms.submissions.show', {
                                    form: form.id,
                                    submission: activeSubmission.id,
                                })}
                                className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                                Open full page
                            </Link>
                            <button
                                type="button"
                                onClick={() => setActiveSubmission(null)}
                                className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
