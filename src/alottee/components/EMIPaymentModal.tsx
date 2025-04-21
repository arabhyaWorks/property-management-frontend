import React from 'react';
import { X } from 'lucide-react';

interface EMIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  emiNumber: number;
  emiAmount: number;
  interestAmount: number;
  lateFee: number;
  dueDate: string;
}

const EMIPaymentModal: React.FC<EMIPaymentModalProps> = ({
  isOpen,
  onClose,
  propertyName,
  emiNumber,
  emiAmount,
  interestAmount,
  lateFee,
  dueDate,
}) => {
  if (!isOpen) return null;

  const totalAmount = emiAmount + interestAmount + lateFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeIn">
      <div 
        className="bg-white rounded-lg p-6 m-4 max-w-sm w-full transform transition-all animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Property Details */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {propertyName}
          </h3>
          <p className="text-gray-600">
            किस्त संख्या / EMI Number: {emiNumber}
          </p>
        </div>

        {/* Amount Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">किस्त जमा धनराशि</p>
              <p className="text-sm text-gray-500">EMI Amount</p>
            </div>
            <p className="font-semibold">₹{emiAmount.toLocaleString('en-IN')}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">किस्त ब्याज धनराशि</p>
              <p className="text-sm text-gray-500">Interest Amount</p>
            </div>
            <p className="font-semibold">₹{interestAmount.toLocaleString('en-IN')}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">विलंब ब्याज धनराशि</p>
              <p className="text-sm text-gray-500">Late Fee</p>
            </div>
            <p className="font-semibold text-red-500">₹{lateFee.toLocaleString('en-IN')}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">देय तिथि</p>
              <p className="text-sm text-gray-500">Due Date</p>
            </div>
            <p className="font-semibold">{dueDate}</p>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">कुल धनराशि</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
              <p className="text-xl font-bold text-blue-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Pay ₹{totalAmount.toLocaleString('en-IN')}
        </button>
      </div>
    </div>
  );
};

export default EMIPaymentModal;