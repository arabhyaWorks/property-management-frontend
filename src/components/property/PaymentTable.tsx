import React from "react";
import { formatIndianNumber, formatDateToDDMMYYYY } from "../../utils/helpers.tsx";

interface Payment {
  installment_amount: string;
  interest_amount: string;
  late_fee: string;
  payment_date: string;
}

interface PaymentTableProps {
  payments: Payment[];
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Installment Amount
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Interest Amount
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Late Fee
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Payment Date
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Total Payment Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => {
            const totalPaymentAmount =
              parseFloat(payment.installment_amount || "0") +
              parseFloat(payment.interest_amount || "0") +
              parseFloat(payment.late_fee || "0");
            return (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {formatIndianNumber(
                    parseFloat(payment.installment_amount || "0")
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {formatIndianNumber(
                    parseFloat(payment.interest_amount || "0")
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {formatIndianNumber(parseFloat(payment.late_fee || "0"))}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {formatDateToDDMMYYYY(payment.payment_date) ||
                    payment.payment_date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {formatIndianNumber(totalPaymentAmount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};