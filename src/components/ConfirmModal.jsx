import React from "react";

const ConfirmModal = React.memo(({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-app/40 backdrop-blur-md z-50">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-80 text-center">
        <h2 className="text-lg font-bold text-secondary mb-4">Are you sure?</h2>
        <p className="text-primary  mb-6">
          This action cannot be undone. Once deleted !!
        </p>
        <div className="flex justify-around">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 dark:hover:bg-gray-600 transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition hover:cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmModal;
