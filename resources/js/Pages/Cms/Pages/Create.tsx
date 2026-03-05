import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        is_published: false,
        is_home: false,
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        New CMS Page
                    </h2>
                    <Link
                        className="text-sm text-gray-600 hover:text-gray-900"
                        href={route('cms.pages.index')}
                    >
                        Back
                    </Link>
                </div>
            }
        >
            <Head title="New CMS Page" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form
                            className="space-y-6 p-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                post(route('cms.pages.store'));
                            }}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title ? (
                                    <div className="mt-1 text-sm text-red-600">{errors.title}</div>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Slug (optional)
                                </label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="about-us"
                                />
                                {errors.slug ? (
                                    <div className="mt-1 text-sm text-red-600">{errors.slug}</div>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                    />
                                    Published
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.is_home}
                                        onChange={(e) => setData('is_home', e.target.checked)}
                                    />
                                    Set as Home
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    className="rounded-md border px-4 py-2 text-sm"
                                    href={route('cms.pages.index')}
                                >
                                    Cancel
                                </Link>
                                <button
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                                    disabled={processing}
                                    type="submit"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
