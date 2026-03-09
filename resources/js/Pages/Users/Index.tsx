import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { UserPlus, Key, UserCog, X } from 'lucide-react';

type Role = {
    id: number;
    name: string;
    slug: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    role_id: number | null;
    role_relation: Role | null;
    created_at: string;
};

type Props = {
    users: User[];
    roles: Role[];
    impersonating: boolean;
    originalUser: User | null;
};

export default function Index({ users, roles, impersonating, originalUser }: Props) {
    const pageProps = usePage().props as unknown as { flash?: { success?: string; error?: string } };
    const flash = pageProps.flash || {};
    const currentUser = usePage().props.auth.user;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState<User | null>(null);

    const defaultRole = roles.find(r => r.slug === 'viewer');
    
    const { data: createData, setData: setCreateData, post, processing: creating, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: defaultRole?.id || roles[0]?.id || 0,
    });

    const { data: passwordData, setData: setPasswordData, put, processing: updatingPassword, errors: passwordErrors, reset: resetPassword } = useForm({
        password: '',
        password_confirmation: '',
    });

    const updateRole = (userId: number, roleId: number) => {
        router.put(
            route('users.update', userId),
            { role_id: roleId },
            {
                preserveScroll: true,
            },
        );
    };

    const handleCreateUser: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreate();
            },
        });
    };

    const handleUpdatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        if (!showPasswordModal) return;
        
        put(route('users.update-password', showPasswordModal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowPasswordModal(null);
                resetPassword();
            },
        });
    };

    const handleImpersonate = (user: User) => {
        if (confirm(`Impersonate ${user.name}? You will be logged in as this user.`)) {
            router.post(route('users.impersonate', user.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Users
                    </h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <UserPlus size={16} />
                        Add User
                    </button>
                </div>
            }
        >
            <Head title="Users" />

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

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Verified
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-700">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 ${
                                                            user.email_verified_at
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {user.email_verified_at ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <select
                                                        value={user.role_id || ''}
                                                        onChange={(e) => updateRole(user.id, parseInt(e.target.value))}
                                                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role.id} value={role.id}>
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setShowPasswordModal(user)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Change Password"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                        {user.id !== currentUser.id && (
                                                            <button
                                                                onClick={() => handleImpersonate(user)}
                                                                className="text-purple-600 hover:text-purple-900"
                                                                title="Impersonate User"
                                                            >
                                                                <UserCog size={16} />
                                                            </button>
                                                        )}
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

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
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

                        <form onSubmit={handleCreateUser}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
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
                                        required
                                    />
                                    <InputError message={createErrors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={createData.password}
                                        onChange={(e) => setCreateData('password', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={createErrors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={createData.password_confirmation}
                                        onChange={(e) => setCreateData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={createErrors.password_confirmation} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role_id" value="Role" />
                                    <select
                                        id="role_id"
                                        value={createData.role_id}
                                        onChange={(e) => setCreateData('role_id', parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={createErrors.role_id} className="mt-2" />
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
                                    {creating ? 'Creating...' : 'Create User'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Change Password for {showPasswordModal.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(null);
                                    resetPassword();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdatePassword}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="new_password" value="New Password" />
                                    <TextInput
                                        id="new_password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={passwordErrors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="new_password_confirmation" value="Confirm New Password" />
                                    <TextInput
                                        id="new_password_confirmation"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={passwordErrors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(null);
                                        resetPassword();
                                    }}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={updatingPassword}>
                                    {updatingPassword ? 'Updating...' : 'Update Password'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
