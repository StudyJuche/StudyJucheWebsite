import { useState, useEffect } from 'react';
import { api } from '../api';
import { User } from './AdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users.');
            toast.error('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const requestVerify = (userId: number) => {
        setConfirmation({
            title: 'Verify User',
            message: 'Are you sure you want to manually verify this user?',
            onConfirm: () => handleVerify(userId),
        });
    };

    const handleVerify = async (userId: number) => {
        try {
            await api.patch(`/api/admin/users/${userId}/verify`);
            toast.success('User verified successfully!');
            fetchUsers(); // Refresh the list
        } catch (err) {
            toast.error('Failed to verify user.');
        } finally {
            setConfirmation(null);
        }
    };

    const requestDelete = (userId: number) => {
        setConfirmation({
            title: 'Delete User',
            message: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
            onConfirm: () => handleDelete(userId),
        });
    };

    const handleDelete = async (userId: number) => {
        try {
            await api.delete(`/api/admin/users/${userId}`);
            toast.success('User deleted successfully!');
            fetchUsers(); // Refresh the list
        } catch (err) {
            toast.error('Failed to delete user.');
        } finally {
            setConfirmation(null);
        }
    };

    if (loading) return <div className="text-center p-8">Loading users...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            {confirmation && (
                <ConfirmationDialog
                    show={!!confirmation}
                    title={confirmation.title}
                    message={confirmation.message}
                    onConfirm={confirmation.onConfirm}
                    onCancel={() => setConfirmation(null)}
                />
            )}
            <h1 className="text-4xl font-bold text-center mb-8">Manage Users</h1>
            <div className="shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                User ID
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {user.id}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {user.username}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {user.email}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span
                                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                                            user.is_verified ? 'text-green-900' : 'text-yellow-900'
                                        }`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`absolute inset-0 ${
                                                user.is_verified ? 'bg-green-200' : 'bg-yellow-200'
                                            } opacity-50 rounded-full`}
                                        ></span>
                                        <span className="relative">{user.is_verified ? 'Verified' : 'Unverified'}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {!user.is_verified && (
                                        <button
                                            onClick={() => requestVerify(user.id)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Verify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => requestDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
