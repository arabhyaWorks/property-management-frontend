import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import PaymentDetails from './PaymentDetails';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ChevronDown, ChevronUp, CreditCard, Receipt } from 'lucide-react';

const TransactionCard = ({ transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { transaction: txn, payments } = transaction;
  
  const isServiceCharge = txn.payment_type === 'serviceCharges';
  const isInstallment = txn.payment_type === 'installments';
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Transaction Header */}
      <div 
        className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
        onClick={toggleExpand}
      >
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            {isServiceCharge ? (
              <Receipt className="h-5 w-5 text-indigo-600" />
            ) : (
              <CreditCard className="h-5 w-5 text-purple-600" />
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                {isServiceCharge ? 'Service Charges' : 'Installment Payment'}
              </h3>
              <div className="text-sm text-gray-500 mt-1">
                <span>{txn.orderId}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(txn.created_at)}</span>
              </div>
            </div>
            
            <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
              <div className="font-medium text-gray-900">{formatCurrency(txn.amount)}</div>
              <StatusBadge status={txn.transaction_error_type || txn.status} />
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center">
              <span className="font-medium">Property:</span>
              <span className="ml-1">{txn.property_id}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Sampatti Sreni:</span>
              <span className="ml-1">{txn.sampatti_sreni}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Sampatti Sankhya:</span>
              <span className="ml-1">{txn.avanti_sampatti_sankhya}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 self-center">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {/* Transaction Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 animate-slideDown">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {isServiceCharge ? 'Service Charge Details' : 'Installment Details'}
          </div>
          
          {payments.map((payment, index) => (
            <PaymentDetails 
              key={index} 
              payment={payment} 
              type={txn.payment_type} 
              isLast={index === payments.length - 1}
            />
          ))}
          
          {txn.transaction_error_type === 'success' && txn.transactionid && (
            <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
              <p className="font-medium">Transaction ID: {txn.transactionid}</p>
              <p className="mt-1">Processed by: {txn.processed_by_name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;