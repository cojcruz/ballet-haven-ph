import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Plus, Edit2, Trash2, X, Shield } from 'lucide-react';

type Role = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    permissions: string[];
    is_system: boolean;
    users_count: number;
    created_at: string;
};

type Props = {
    roles: Role[];
};

const AVAILABLE_PERMISSIONS = [
    { value: '*', label: 'All Permissions', description: 'Full system access' },
    { value: 'view_dashboard', label: 'View Dashboard', description: 'Access to dashboard' },
    { value: 'manage_cms', label: 'Manage CMS', description: 'Create and edit pages' },
    { value: 'manage_events', label: 'Manage Events', description: 'Create and edit events' },
    { value: 'manage_forms', label: 'Manage Forms', description: 'Create and edit forms' },
    { value: 'manage_users', label: 'Manage Users', description: 'Create and edit users' },
    { value: 'manage_roles', label: 'Manage Roles', description: 'Create and edit roles' },
];

export default function Index({ roles }: Props) {
    const pageProps = usePage().props as unknown as { flash?: { success?: string; error?: string } };
    const flash = pageProps.flash || {};

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const { data: createData, setData: setCreateData, post, processing: creating, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as string[],
    });

    const { data: editData, setData: setEditData, put, processing: updating, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as string[],
    });

    const handleCreateRole: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreate();
            },
        });
    };

    const handleUpdateRole: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingRole) return;
        
        put(route('roles.update', editingRole.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingRole(null);
                resetEdit();
            },
        });
    };

    const handleDeleteRole = (role: Role) => {
        if (confirm(`Delete role "${role.name}"? This cannot be undone.`)) {
            router.delete(route('roles.destroy', role.id), {
                preserveScroll: true,
            });
        }
    };

    const openEditModal = (role: Role) => {
        setEditingRole(role);
        setEditData({
            name: role.name,
            slug: role.slug,
            description: role.description || '',
            permissions: role.permissions || [],
        });
    };

    const togglePermission = (permission: string, isCreate: boolean) => {
        if (isCreate) {
            const current = createData.permissions;
            if (current.includes(permission)) {
                setCreateData('permissions', current.filter(p => p !== permission));
            } else {
                setCreateData('permissions', [...current, permission]);
            }
        } else {
            const current = editData.permissions;
            if (current.includes(permission)) {
                setEditData('permissions', current.filter(p => p !== permission));
            } else {
                setEditData('permissions', [...current, permission]);
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Roles & Permissions
                    </h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus size={16} />
                        Add Role
                    </button>
                </div>
            }
        >
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {(flash.success || flash.error) && (
                        <div className="mb-4">
                            {flash.success && (
                                <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                                    {flash.success}
                                </div>
                            )}
                            {flash.error && (
                                <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                                    {flash.error}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className="overflow-hidden rounded-lg bg-white shadow-sm"
                            >
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="text-indigo-600" size={20} />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {role.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {role.slug}
                                                </p>
                                            </div>
                                        </div>
                                        {role.is_system && (
                                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                System
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="px-6 py-4">
                                    {role.description && (
                                        <p className="mb-3 text-sm text-gray-600">
                                            {role.description}
                                        </p>
                                    )}

                                    <div className="mb-3">
                                        <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                                            Permissions
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                role.permissions.map((permission, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No permissions
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {role.users_count} user{role.users_count !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(role)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="Edit Role"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {!role.is_system && (
                                            <button
                                                onClick={() => handleDeleteRole(role)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Role"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Role</h3>
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

                        <form onSubmit={handleCreateRole}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Role Name" />
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
                                    <InputLabel htmlFor="slug" value="Slug (lowercase, no spaces)" />
                                    <TextInput
                                        id="slug"
                                        type="text"
                                        value={createData.slug}
                                        onChange={(e) => setCreateData('slug', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                        placeholder="e.g., content-editor"
                                    />
                                    <InputError message={createErrors.slug} className="mt-2" />
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
                                    <InputLabel htmlFor="permissions" value="Permissions" />
                                    <div className="mt-2 space-y-2">
                                        {AVAILABLE_PERMISSIONS.map((perm) => (
                                            <label
                                                key={perm.value}
                                                className="flex items-start gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={createData.permissions.includes(perm.value)}
                                                    onChange={() => togglePermission(perm.value, true)}
                                                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm text-gray-900">
                                                        {perm.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {perm.description}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={createErrors.permissions} className="mt-2" />
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
                                    {creating ? 'Creating...' : 'Create Role'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Edit Role: {editingRole.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setEditingRole(null);
                                    resetEdit();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateRole}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="edit_name" value="Role Name" />
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
                                    <InputLabel htmlFor="edit_slug" value="Slug (lowercase, no spaces)" />
                                    <TextInput
                                        id="edit_slug"
                                        type="text"
                                        value={editData.slug}
                                        onChange={(e) => setEditData('slug', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={editErrors.slug} className="mt-2" />
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

                                <div>
                                    <InputLabel htmlFor="edit_permissions" value="Permissions" />
                                    <div className="mt-2 space-y-2">
                                        {AVAILABLE_PERMISSIONS.map((perm) => (
                                            <label
                                                key={perm.value}
                                                className="flex items-start gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={editData.permissions.includes(perm.value)}
                                                    onChange={() => togglePermission(perm.value, false)}
                                                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm text-gray-900">
                                                        {perm.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {perm.description}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={editErrors.permissions} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingRole(null);
                                        resetEdit();
                                    }}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={updating}>
                                    {updating ? 'Updating...' : 'Update Role'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
