import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

type CmsPage = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_home: boolean;
    updated_at: string;
};

export default function Index({ pages }: { pages: CmsPage[] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        CMS Pages
                    </h2>
                    <Link
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                        href={route('cms.pages.create')}
                    >
                        New Page
                    </Link>
                </div>
            }
        >
            <Head title="CMS Pages" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2">Title</th>
                                            <th className="py-2">Slug</th>
                                            <th className="py-2">Status</th>
                                            <th className="py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pages.map((page) => (
                                            <tr key={page.id} className="border-b last:border-b-0">
                                                <td className="py-3 font-medium">
                                                    {page.title}
                                                    {page.is_home ? (
                                                        <span className="ml-2 rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                                                            Home
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td className="py-3 text-gray-600">{page.slug}</td>
                                                <td className="py-3">
                                                    {page.is_published ? (
                                                        <span className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">
                                                            Published
                                                        </span>
                                                    ) : (
                                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                                                            Draft
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                                            href={route('cms.pages.edit', page.id)}
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            className="text-sm text-red-600 hover:text-red-900"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Delete this page? This will also delete its blocks.',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        route('cms.pages.destroy', page.id),
                                                                    );
                                                                }
                                                            }}
                                                            type="button"
                                                        >
                                                            Delete
                                                        </button>
                                                        <a
                                                            className="text-sm text-gray-600 hover:text-gray-900"
                                                            href={route('cms.public.show', page.slug)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            View
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
