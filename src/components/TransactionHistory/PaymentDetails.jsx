import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentDetails = ({ payment, type, isLast }) => {
  const isServiceCharge = type === 'serviceCharges';
  const containerClasses = `py-3 ${!isLast ? 'border-b border-gray-200' : ''}`;
  
  if (isServiceCharge) {
    // Service Charge Payment
    const { 
      service_charge_id,
      service_charge_financial_year,
      service_charge_amount,
      service_charge_late_fee,
      service_charge_payment_date,
      status
    } = payment;
    
    const totalAmount = parseFloat(service_charge_amount) + parseFloat(service_charge_late_fee);
    
    return (
      <div className={containerClasses}>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <p className="font-medium text-gray-900">{service_charge_id}</p>
            <p className="text-sm text-gray-600">For Financial Year: {service_charge_financial_year}</p>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-gray-900 font-medium">{formatCurrency(totalAmount)}</p>
            <p className="text-xs text-gray-500">Status: {status}</p>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Base Amount:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(service_charge_amount)}</span>
          </div>
          <div>
            <span className="text-gray-500">Late Fee:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(service_charge_late_fee)}</span>
          </div>
          <div>
            <span className="text-gray-500">Payment Date:</span>
            <span className="ml-1 font-medium text-gray-700">{formatDate(service_charge_payment_date)}</span>
          </div>
        </div>
      </div>
    );
  } else {
    // Installment Payment
    const {
      payment_id,
      payment_number,
      payment_amount,
      kisht_mool_paid,
      kisht_byaj_paid,
      late_fee_amount,
      total_payment_amount_with_late_fee,
      payment_due_date,
      status
    } = payment;
    
    return (
      <div className={containerClasses}>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <p className="font-medium text-gray-900">{payment_id}</p>
            <p className="text-sm text-gray-600">Installment #{payment_number}</p>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-gray-900 font-medium">{formatCurrency(total_payment_amount_with_late_fee)}</p>
            <p className="text-xs text-gray-500">Status: {status}</p>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Principal Amount:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(kisht_mool_paid)}</span>
          </div>
          <div>
            <span className="text-gray-500">Interest:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(kisht_byaj_paid)}</span>
          </div>
          <div>
            <span className="text-gray-500">Late Fee:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(late_fee_amount)}</span>
          </div>
          <div>
            <span className="text-gray-500">Base Amount:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(payment_amount)}</span>
          </div>
          <div>
            <span className="text-gray-500">Total Amount:</span>
            <span className="ml-1 font-medium text-gray-700">{formatCurrency(total_payment_amount_with_late_fee)}</span>
          </div>
          <div>
            <span className="text-gray-500">Due Date:</span>
            <span className="ml-1 font-medium text-gray-700">{formatDate(payment_due_date)}</span>
          </div>
        </div>
      </div>
    );
  }
};

export default PaymentDetails;