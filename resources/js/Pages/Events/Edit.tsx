import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type Event = {
    id: number;
    name: string;
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    details: string | null;
    location: string | null;
    registration_link: string | null;
    featured_image: string | null;
    featured: boolean;
    published: boolean;
};

type Props = {
    event: Event;
};

export default function Edit({ event }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        start_date: string;
        end_date: string;
        start_time: string;
        end_time: string;
        details: string;
        location: string;
        registration_link: string;
        featured_image: File | null;
        featured: boolean;
        published: boolean;
        _method: string;
    }>({
        name: event.name,
        start_date: event.start_date.split('T')[0],
        end_date: event.end_date?.split('T')[0] || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        details: event.details || '',
        location: event.location || '',
        registration_link: event.registration_link || '',
        featured_image: null,
        featured: event.featured,
        published: event.published,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        event.featured_image ? `/storage/${event.featured_image}` : null
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('featured_image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('events.update', event.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Event
                </h2>
            }
        >
            <Head title="Edit Event" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.start_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.end_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Event Details
                                </label>
                                <textarea
                                    value={data.details}
                                    onChange={(e) => setData('details', e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="e.g., Cultural Center of the Philippines, Manila"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Registration Link
                                </label>
                                <input
                                    type="url"
                                    value={data.registration_link}
                                    onChange={(e) => setData('registration_link', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="https://..."
                                />
                                {errors.registration_link && (
                                    <p className="mt-1 text-sm text-red-600">{errors.registration_link}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Featured Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {errors.featured_image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>
                                )}
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 h-32 w-auto rounded-md object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.featured}
                                        onChange={(e) => setData('featured', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Featured Event</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.published}
                                        onChange={(e) => setData('published', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Published</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                <Link
                                    href={route('events.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Update Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
