import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

type Academy = {
    id: number;
    name: string;
    email: string | null;
    location: string | null;
    specialty: string | null;
    founded: string | null;
    logo: string | null;
    logo_url: string | null;
    social_media: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        website?: string;
    } | null;
    photos: string[] | null;
    photo_urls: string[];
    description: string | null;
    is_published: boolean;
    sort_order: number;
    created_at: string;
};

type Props = {
    academies: Academy[];
};

export default function Index({ academies }: Props) {
    const pageProps = usePage().props as unknown as { flash?: { success?: string; error?: string } };
    const flash = pageProps.flash || {};

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingAcademy, setEditingAcademy] = useState<Academy | null>(null);

    const { data: createData, setData: setCreateData, post, processing: creating, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        location: '',
        specialty: '',
        founded: '',
        description: '',
        logo: null as File | null,
        photos: [] as File[],
        social_media: {
            facebook: '',
            instagram: '',
            twitter: '',
            website: '',
        },
        is_published: true,
        sort_order: 0,
    });

    const { data: editData, setData: setEditData, post: postEdit, processing: updating, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        email: '',
        location: '',
        specialty: '',
        founded: '',
        description: '',
        logo: null as File | null,
        photos: [] as File[],
        social_media: {
            facebook: '',
            instagram: '',
            twitter: '',
            website: '',
        },
        is_published: true,
        sort_order: 0,
        _method: 'PUT',
    });

    const handleCreateAcademy: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('academies.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreate();
            },
        });
    };

    const handleUpdateAcademy: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingAcademy) return;

        postEdit(route('academies.update', editingAcademy.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingAcademy(null);
                resetEdit();
            },
        });
    };

    const handleDeleteAcademy = (academy: Academy) => {
        if (confirm(`Delete academy "${academy.name}"? This cannot be undone.`)) {
            router.delete(route('academies.destroy', academy.id), {
                preserveScroll: true,
            });
        }
    };

    const openEditModal = (academy: Academy) => {
        setEditingAcademy(academy);
        setEditData({
            name: academy.name,
            email: academy.email || '',
            location: academy.location || '',
            specialty: academy.specialty || '',
            founded: academy.founded || '',
            description: academy.description || '',
            logo: null,
            photos: [],
            social_media: {
                facebook: academy.social_media?.facebook || '',
                instagram: academy.social_media?.instagram || '',
                twitter: academy.social_media?.twitter || '',
                website: academy.social_media?.website || '',
            },
            is_published: academy.is_published,
            sort_order: academy.sort_order,
            _method: 'PUT',
        });
    };

    const handleDeletePhoto = (academy: Academy, photo: string) => {
        if (confirm('Delete this photo?')) {
            router.delete(route('academies.delete-photo', academy.id), {
                data: { photo },
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Academies Management
                    </h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                        <Plus size={16} />
                        Add Academy
                    </button>
                </div>
            }
        >
            <Head title="Academies Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{flash.success}</p>
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{flash.error}</p>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {academies.map((academy) => (
                                    <div
                                        key={academy.id}
                                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                                    >
                                        {academy.logo_url && (
                                            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                                <img
                                                    src={academy.logo_url}
                                                    alt={academy.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="p-4">
                                            <div className="mb-2 flex items-start justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {academy.name}
                                                </h3>
                                                {!academy.is_published && (
                                                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>

                                            {academy.location && (
                                                <p className="text-sm text-gray-600">{academy.location}</p>
                                            )}

                                            {academy.specialty && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    <span className="font-medium">Specialty:</span> {academy.specialty}
                                                </p>
                                            )}

                                            {academy.founded && (
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-medium">Founded:</span> {academy.founded}
                                                </p>
                                            )}

                                            {academy.email && (
                                                <p className="mt-2 text-sm text-gray-600">{academy.email}</p>
                                            )}

                                            {academy.photo_urls && academy.photo_urls.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-xs text-gray-500">
                                                        {academy.photo_urls.length} additional photo(s)
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(academy)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Edit Academy"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAcademy(academy)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete Academy"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {academies.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500">No academies yet. Create your first academy!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Academy</h3>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetCreate();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAcademy}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value="School Name *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={createData.name}
                                        onChange={(e) => setCreateData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={createErrors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={createData.email}
                                        onChange={(e) => setCreateData('email', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={createErrors.email} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="location" value="Location" />
                                        <TextInput
                                            id="location"
                                            type="text"
                                            value={createData.location}
                                            onChange={(e) => setCreateData('location', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={createErrors.location} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="founded" value="Founded Year" />
                                        <TextInput
                                            id="founded"
                                            type="text"
                                            value={createData.founded}
                                            onChange={(e) => setCreateData('founded', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g., 1993"
                                        />
                                        <InputError message={createErrors.founded} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="specialty" value="Specialty" />
                                    <TextInput
                                        id="specialty"
                                        type="text"
                                        value={createData.specialty}
                                        onChange={(e) => setCreateData('specialty', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="e.g., Classical & Contemporary"
                                    />
                                    <InputError message={createErrors.specialty} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        value={createData.description}
                                        onChange={(e) => setCreateData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                    />
                                    <InputError message={createErrors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="logo" value="Logo" />
                                    <input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCreateData('logo', e.target.files?.[0] || null)}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    <InputError message={createErrors.logo} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="photos" value="Additional Photos" />
                                    <input
                                        id="photos"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setCreateData('photos', Array.from(e.target.files || []))}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    <InputError message={createErrors.photos} className="mt-2" />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel value="Social Media" />
                                    
                                    <div>
                                        <TextInput
                                            type="url"
                                            value={createData.social_media.facebook}
                                            onChange={(e) => setCreateData('social_media', { ...createData.social_media, facebook: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Facebook URL"
                                        />
                                    </div>

                                    <div>
                                        <TextInput
                                            type="url"
                                            value={createData.social_media.instagram}
                                            onChange={(e) => setCreateData('social_media', { ...createData.social_media, instagram: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Instagram URL"
                                        />
                                    </div>

                                    <div>
                                        <TextInput
                                            type="url"
                                            value={createData.social_media.twitter}
                                            onChange={(e) => setCreateData('social_media', { ...createData.social_media, twitter: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Twitter URL"
                                        />
                                    </div>

                                    <div>
                                        <TextInput
                                            type="url"
                                            value={createData.social_media.website}
                                            onChange={(e) => setCreateData('social_media', { ...createData.social_media, website: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Website URL"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={createData.is_published}
                                            onChange={(e) => setCreateData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Published</span>
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <InputLabel htmlFor="sort_order" value="Sort Order" />
                                        <TextInput
                                            id="sort_order"
                                            type="number"
                                            value={createData.sort_order.toString()}
                                            onChange={(e) => setCreateData('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetCreate();
                                    }}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={creating}>
                                    {creating ? 'Creating...' : 'Create Academy'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingAcademy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Edit Academy: {editingAcademy.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setEditingAcademy(null);
                                    resetEdit();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateAcademy}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="edit_name" value="School Name *" />
                                    <TextInput
                                        id="edit_name"
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={editErrors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="edit_email" value="Email" />
                                    <TextInput
                                        id="edit_email"
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData('email', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={editErrors.email} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="edit_location" value="Location" />
                                        <TextInput
                                            id="edit_location"
                                            type="text"
                                            value={editData.location}
                                            onChange={(e) => setEditData('location', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={editErrors.location} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="edit_founded" value="Founded Year" />
                                        <TextInput
                                            id="edit_founded"
                                            type="text"
                                            value={editData.founded}
                                            onChange={(e) => setEditData('founded', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={editErrors.founded} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="edit_specialty" value="Specialty" />
                                    <TextInput
                                        id="edit_specialty"
                                        type="text"
                                        value={editData.specialty}
                                        onChange={(e) => setEditData('specialty', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={editErrors.specialty} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="edit_description" value="Description" />
                                    <textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) => setEditData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                    />
                                    <InputError message={editErrors.description} className="mt-2" />
                                </div>

                                {editingAcademy.logo_url && (
                                    <div>
                                        <InputLabel value="Current Logo" />
                                        <img
                                            src={editingAcademy.logo_url}
                                            alt="Current logo"
                                            className="mt-2 h-32 w-32 rounded object-cover"
                                        />
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="edit_logo" value="New Logo (optional)" />
                                    <input
                                        id="edit_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditData('logo', e.target.files?.[0] || null)}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    <InputError message={editErrors.logo} className="mt-2" />
                                </div>

                                {editingAcademy.photo_urls && editingAcademy.photo_urls.length > 0 && (
                                    <div>
                                        <InputLabel value="Current Photos" />
                                        <div className="mt-2 grid grid-cols-4 gap-2">
                                            {editingAcademy.photo_urls.map((url, idx) => (
                                                <div key={idx} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`Photo ${idx + 1}`}
                                                        className="h-20 w-20 rounded object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePhoto(editingAcademy, editingAcademy.photos![idx])}
                                                        className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="edit_photos" value="Add More Photos (optional)" />
                                    <input
                                        id="edit_photos"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setEditData('photos', Array.from(e.target.files || []))}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    <InputError message={editErrors.photos} className="mt-2" />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel value="Social Media" />
                                    
                                    <div>
                                        <TextInput
                                            type="url"
                                            value={editData.social_media.facebook}
                                            onChange={(e) => setEditData('social_media', { ...editData.social_media, facebook: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Facebook URL"
                                        />
                                    </div>

                                    <div>
                                        <TextInput
                                            type="url"
                                            value={editData.social_media.instagram}
                                            onChange={(e) => setEditData('social_media', { ...editData.social_media, instagram: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Instagram URL"
                                        />
                                    </div>

                                    <div>
                                        <TextInput
                                            type="url"
                                            value={editData.social_media.twitter}
                                            onChange={(e) => setEditData('social_media', { ...editData.social_media, twitter: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Twitter URL"
                                        />
                                    </div>

                                    <div>
                                        <TextInput
                                            type="url"
                                            value={editData.social_media.website}
                                            onChange={(e) => setEditData('social_media', { ...editData.social_media, website: e.target.value })}
                                            className="mt-1 block w-full"
                                            placeholder="Website URL"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={editData.is_published}
                                            onChange={(e) => setEditData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Published</span>
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <InputLabel htmlFor="edit_sort_order" value="Sort Order" />
                                        <TextInput
                                            id="edit_sort_order"
                                            type="number"
                                            value={editData.sort_order.toString()}
                                            onChange={(e) => setEditData('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingAcademy(null);
                                        resetEdit();
                                    }}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={updating}>
                                    {updating ? 'Updating...' : 'Update Academy'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
