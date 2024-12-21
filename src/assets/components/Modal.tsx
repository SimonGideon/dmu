import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, body, footer, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      aria-live="assertive"
    >
      <div
        className="bg-white  dark:bg-darkBackground dark:text-white rounded-lg shadow-lg max-w-md w-full p-6"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">{body}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
