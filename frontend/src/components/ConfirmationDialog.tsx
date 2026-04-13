import React from 'react';

interface ConfirmationDialogProps {
  show: boolean; // Changed from isOpen to show
  title: string;
  message: React.ReactNode; // Changed type to React.ReactNode
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string; // New prop
  confirmButtonClass?: string; // New prop
}

export const ConfirmationDialog = ({ show, title, message, onConfirm, onCancel, confirmButtonText = 'Confirm', confirmButtonClass = 'bg-red-600 hover:bg-red-700' }: ConfirmationDialogProps) => {
  if (!show) return null; // Use 'show' prop

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="text-gray-600 mb-6">{message}</div> {/* Render message as React.ReactNode */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white font-semibold ${confirmButtonClass}`} // Use confirmButtonClass
          >
            {confirmButtonText} {/* Use confirmButtonText */}
          </button>
        </div>
      </div>
    </div>
  );
};
