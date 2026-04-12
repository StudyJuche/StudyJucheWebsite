import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Notification = ({ message, type, onClose }: NotificationProps) => {
  if (!message) return null;

  const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white flex justify-between items-center z-50';
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg">&times;</button>
    </div>
  );
};
