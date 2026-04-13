import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { changePassword, deleteUserAccount } from '../api/auth';
import { ConfirmationDialog } from '../components/ConfirmationDialog'; // Assuming this exists
import { Notification } from '../components/Notification'; // Assuming this exists

export const UserSettings = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteMessage, setDeleteMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  if (!user) {
    // Should ideally be handled by route protection, but good for fallback
    return <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto flex items-center justify-center"><p>Please log in to view settings.</p></div>;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (!token) {
      setPasswordChangeMessage({ type: 'error', message: 'Authentication token missing.' });
      return;
    }

    try {
      await changePassword(token, currentPassword, newPassword);
      setPasswordChangeMessage({ type: 'success', message: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      setPasswordChangeMessage({ type: 'error', message: error.message || 'Failed to change password.' });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMessage(null);
    if (!token) {
      setDeleteMessage({ type: 'error', message: 'Authentication token missing.' });
      return;
    }
    if (deleteUsername !== user.username) {
      setDeleteMessage({ type: 'error', message: 'Username does not match.' });
      return;
    }

    try {
      await deleteUserAccount(token, deleteUsername, deletePassword);
      setDeleteMessage({ type: 'success', message: 'Account deleted successfully. Redirecting...' });
      setShowDeleteDialog(false);
      logout(); // Log out the user
      navigate('/'); // Redirect to home page
    } catch (error: any) {
      setDeleteMessage({ type: 'error', message: error.message || 'Failed to delete account. Please check your credentials.' });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">User Settings</h1>

          {/* Change Password Section */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            {passwordChangeMessage && (
              <Notification
                message={passwordChangeMessage.message}
                type={passwordChangeMessage.type}
                onClose={() => setPasswordChangeMessage(null)}
              />
            )}
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="current-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm-new-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Delete Account Section */}
          <div>
            <h2 className="text-2xl font-bold text-red-800 mb-6">Delete Account</h2>
            <p className="text-gray-700 mb-6">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {deleteMessage && (
              <Notification
                message={deleteMessage.message}
                type={deleteMessage.type}
                onClose={() => setDeleteMessage(null)}
              />
            )}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Delete My Account
            </button>

            <ConfirmationDialog
              show={showDeleteDialog}
              title="Confirm Account Deletion"
              message={
                <>
                  <p className="mb-4">This action is irreversible. To confirm, please type your username and password below.</p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="delete-username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        id="delete-username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        value={deleteUsername}
                        onChange={(e) => setDeleteUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        id="delete-password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              }
              onConfirm={handleDeleteAccount}
              onCancel={() => {
                setShowDeleteDialog(false);
                setDeleteUsername('');
                setDeletePassword('');
                setDeleteMessage(null);
              }}
              confirmButtonText="Delete Account"
              confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
