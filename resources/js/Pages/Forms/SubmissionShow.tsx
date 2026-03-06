import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

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
    submission: Submission;
};

export default function SubmissionShow({ form, submission }: Props) {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Submission #{submission.id}: {form.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(submission.created_at)}</p>
                    </div>
                    <Link
                        href={route('forms.submissions', form.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        ← Back to Submissions
                    </Link>
                </div>
            }
        >
            <Head title={`Submission #${submission.id}: ${form.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="rounded-md border border-gray-200 p-3">
                                    <div className="text-xs font-medium text-gray-500">IP Address</div>
                                    <div className="text-sm text-gray-900">{submission.ip_address || '-'}</div>
                                </div>
                                {submission.user_agent !== undefined && (
                                    <div className="rounded-md border border-gray-200 p-3">
                                        <div className="text-xs font-medium text-gray-500">User Agent</div>
                                        <div className="text-sm text-gray-900 break-words">{submission.user_agent || '-'}</div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-md border border-gray-200">
                                <div className="p-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                                    Submitted Data
                                </div>
                                <div className="p-3 space-y-5">
                                    {form.fields.map((field) => (
                                        <div key={field.id}>
                                            <div className="text-xs font-medium text-gray-600">{field.label}</div>
                                            <div className="mt-1 text-sm text-gray-900 whitespace-normal">
                                                {formatValue(submission.data[field.name], field)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
