import React from 'react';
import { X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeIn">
      <div 
        className="bg-white rounded-lg p-6 m-4 max-w-sm w-full transform transition-all animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-center mt-2">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-blue-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
              <p className="text-gray-600 mb-4">
                We're working hard to bring you something amazing. Stay tuned!
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;