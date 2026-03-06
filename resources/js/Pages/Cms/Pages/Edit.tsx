import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/Cms/RichTextEditor';
import { Head, Link, useForm, router } from '@inertiajs/react';

type CmsBlock = {
    id: number;
    type: string;
    data: any;
    sort_order: number;
    is_enabled: boolean;
};

type CmsPage = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_home: boolean;
    blocks: CmsBlock[];
};

export default function Edit({ page }: { page: CmsPage }) {
    const pageForm = useForm({
        title: page.title,
        slug: page.slug,
        is_published: page.is_published,
        is_home: page.is_home,
    });

    const newBlockForm = useForm({
        type: 'rich_text',
        sort_order: (page.blocks?.length ?? 0) + 1,
        is_enabled: true,
        data: '',
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Page: {page.title}
                    </h2>
                    <div className="flex items-center gap-3">
                        <a
                            className="text-sm text-gray-600 hover:text-gray-900"
                            href={route('cms.public.show', page.slug)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View
                        </a>
                        <Link
                            className="text-sm text-gray-600 hover:text-gray-900"
                            href={route('cms.pages.index')}
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${page.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-8 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form
                            className="space-y-6 p-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                pageForm.put(route('cms.pages.update', page.id));
                            }}
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={pageForm.data.title}
                                        onChange={(e) => pageForm.setData('title', e.target.value)}
                                    />
                                    {pageForm.errors.title ? (
                                        <div className="mt-1 text-sm text-red-600">
                                            {pageForm.errors.title}
                                        </div>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Slug
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={pageForm.data.slug}
                                        onChange={(e) => pageForm.setData('slug', e.target.value)}
                                    />
                                    {pageForm.errors.slug ? (
                                        <div className="mt-1 text-sm text-red-600">
                                            {pageForm.errors.slug}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={pageForm.data.is_published}
                                        onChange={(e) =>
                                            pageForm.setData('is_published', e.target.checked)
                                        }
                                    />
                                    Published
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={pageForm.data.is_home}
                                        onChange={(e) =>
                                            pageForm.setData('is_home', e.target.checked)
                                        }
                                    />
                                    Set as Home
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                                    disabled={pageForm.processing}
                                    type="submit"
                                >
                                    Save Page
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form
                            className="space-y-4 p-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                newBlockForm.post(route('cms.blocks.store', page.id));
                            }}
                        >
                            <div className="text-lg font-medium text-gray-900">Add Block</div>

                            <div className="grid gap-6 md:grid-cols-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Type
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={newBlockForm.data.type}
                                        onChange={(e) => {
                                            const nextType = e.target.value;
                                            newBlockForm.setData('type', nextType);

                                            if (nextType === 'rich_text') {
                                                newBlockForm.setData('data', '');
                                            } else if (nextType === 'hero') {
                                                newBlockForm.setData(
                                                    'data',
                                                    '{\n  "title": "",\n  "subtitle": ""\n}',
                                                );
                                            } else {
                                                newBlockForm.setData('data', '{}');
                                            }
                                        }}
                                    >
                                        <option value="hero">hero</option>
                                        <option value="rich_text">rich_text</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={newBlockForm.data.sort_order}
                                        onChange={(e) =>
                                            newBlockForm.setData('sort_order', Number(e.target.value))
                                        }
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={newBlockForm.data.is_enabled}
                                            onChange={(e) =>
                                                newBlockForm.setData('is_enabled', e.target.checked)
                                            }
                                        />
                                        Enabled
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {newBlockForm.data.type === 'rich_text' ? 'Content' : 'Data (JSON)'}
                                </label>

                                {newBlockForm.data.type === 'rich_text' ? (
                                    <div className="mt-1">
                                        <RichTextEditor
                                            value={newBlockForm.data.data}
                                            onChange={(html) => newBlockForm.setData('data', html)}
                                        />
                                    </div>
                                ) : (
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm"
                                        rows={6}
                                        value={newBlockForm.data.data}
                                        onChange={(e) => newBlockForm.setData('data', e.target.value)}
                                    />
                                )}
                                {newBlockForm.errors.data ? (
                                    <div className="mt-1 text-sm text-red-600">{newBlockForm.errors.data}</div>
                                ) : null}
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                                    disabled={newBlockForm.processing}
                                    type="submit"
                                >
                                    Add Block
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4 text-lg font-medium text-gray-900">Blocks</div>

                            {(page.blocks ?? []).length === 0 ? (
                                <div className="text-sm text-gray-600">No blocks yet.</div>
                            ) : (
                                <div className="space-y-6">
                                    {(page.blocks ?? [])
                                        .slice()
                                        .sort((a, b) => a.sort_order - b.sort_order)
                                        .map((block) => (
                                            <BlockEditor key={block.id} page={page} block={block} />
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="text-sm text-red-600 hover:text-red-900"
                            type="button"
                            onClick={() => {
                                if (confirm('Delete this page? This will also delete its blocks.')) {
                                    router.delete(route('cms.pages.destroy', page.id));
                                }
                            }}
                        >
                            Delete page
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function BlockEditor({ page, block }: { page: CmsPage; block: CmsBlock }) {
    const form = useForm({
        type: block.type,
        sort_order: block.sort_order,
        is_enabled: block.is_enabled,
        data:
            block.type === 'rich_text'
                ? String(block.data?.html ?? block.data?.text ?? '')
                : JSON.stringify(block.data ?? {}, null, 2),
    });

    return (
        <div className="rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">
                    #{block.id} · {block.type}
                </div>
                <button
                    className="text-sm text-red-600 hover:text-red-900"
                    type="button"
                    onClick={() => {
                        if (confirm('Delete this block?')) {
                            router.delete(route('cms.blocks.destroy', [page.id, block.id]));
                        }
                    }}
                >
                    Delete
                </button>
            </div>

            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.put(route('cms.blocks.update', [page.id, block.id]));
                }}
            >
                <div className="grid gap-6 md:grid-cols-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={form.data.type}
                            onChange={(e) => form.setData('type', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={form.data.sort_order}
                            onChange={(e) => form.setData('sort_order', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.is_enabled}
                                onChange={(e) => form.setData('is_enabled', e.target.checked)}
                            />
                            Enabled
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {form.data.type === 'rich_text' ? 'Content' : 'Data (JSON)'}
                    </label>

                    {form.data.type === 'rich_text' ? (
                        <div className="mt-1">
                            <RichTextEditor
                                value={form.data.data}
                                onChange={(html) => form.setData('data', html)}
                            />
                        </div>
                    ) : (
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm"
                            rows={6}
                            value={form.data.data}
                            onChange={(e) => form.setData('data', e.target.value)}
                        />
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                        disabled={form.processing}
                        type="submit"
                    >
                        Save Block
                    </button>
                </div>
            </form>
        </div>
    );
}
