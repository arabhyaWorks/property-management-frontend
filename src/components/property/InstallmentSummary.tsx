import React from "react";
import { formatIndianNumber } from "../../utils/helpers";

interface InstallmentSummaryProps {
  avsheshDhanrashi: number;
  interestRate: number;
  timePeriod: number;
  idealNumberOfInstallments: number;
}

export const InstallmentSummary: React.FC<InstallmentSummaryProps> = ({
  avsheshDhanrashi,
  interestRate,
  timePeriod,
  idealNumberOfInstallments,
}) => {
  const totalInterestAmount = (avsheshDhanrashi * interestRate * timePeriod) / 100;
  const adjustedInterest = totalInterestAmount / 2;
  const kulYog = avsheshDhanrashi + adjustedInterest;
  const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
  const idealKishtMool = avsheshDhanrashi / idealNumberOfInstallments;
  const idealKishtByaj = adjustedInterest / idealNumberOfInstallments;
  const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Installment Plan Summary
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">अवशेष धनराशि</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(avsheshDhanrashi)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            कुल ब्याज राशि (एक वर्ष)
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(totalInterestAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ब्याज राशि (छह महीने)
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              {formatIndianNumber(adjustedInterest)}
            </span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">कुल योग</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(kulYog)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            तिमहि किस्त धनराशी
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(idealInstallmentAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            किस्त मूल धनराशी
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(idealKishtMool)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            किस्त ब्याज धनराशी
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(idealKishtByaj)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            प्रति दिन विलंब धनराशी
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatIndianNumber(lateFeePerDay)}
          </p>
        </div>
      </div>
    </div>
  );
};