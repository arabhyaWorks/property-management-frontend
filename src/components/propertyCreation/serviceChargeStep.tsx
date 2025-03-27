import React, { useState, useEffect } from "react";

interface ServiceChargeStepProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

// Form step structure (copied from main file, only step 6 is needed)
interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "boolean" | "file";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
}

const serviceChargeFields: FormField[] = [
  {
    id: "service_charge_financial_year",
    label: "वित्तीय वर्ष",
    type: "select",
    options: [],
    required: true,
  },
  {
    id: "service_charge_amount",
    label: "सेवा शुल्क राशि",
    type: "number",
    required: true,
    readOnly: true,
  },
  {
    id: "service_charge_late_fee",
    label: "सेवा शुल्क विलंब शुल्क",
    type: "number",
    required: true,
    readOnly: true,
  },
  {
    id: "service_charge_payment_date",
    label: "सेवा शुल्क भुगतान तिथि",
    type: "date",
    required: true,
  },
];

function ServiceChargeStep({
  formData,
  setFormData,
  errors,
  setErrors,
}: ServiceChargeStepProps) {
  const [financialYearOptions, setFinancialYearOptions] = useState<string[]>([]);

  // Utility functions
  const getFinancialYearFromDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const financialYear =
      month < 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
    return financialYear;
  };

  const generateFinancialYearOptions = (allotmentDate: string): string[] => {
    const allotmentFY = getFinancialYearFromDate(allotmentDate);
    const [startYear] = allotmentFY.split("-").map(Number);

    const options: string[] = [];
    for (let year = startYear; year <= 2025; year++) {
      options.push(`${year}-${year + 1}`);
    }
    return options;
  };

  const calculateServiceChargeLateFee = (
    allotmentFY: string,
    selectedFY: string,
    paymentDate: string,
    serviceChargeAmount: number
  ): number => {
    if (!allotmentFY || !selectedFY || !paymentDate) return 0;

    const [selectedStartYear] = selectedFY.split("-").map(Number);
    const dueDate = new Date(`${selectedStartYear + 1}-03-31`);
    const payment = new Date(paymentDate);

    if (payment <= dueDate) return 0;

    const currentDate = new Date("2025-03-23");
    const yearsDelayed = currentDate.getFullYear() - (selectedStartYear + 1);

    if (yearsDelayed <= 0) return 0;
    if (yearsDelayed === 1) return serviceChargeAmount * 0.05;
    if (yearsDelayed === 2) return serviceChargeAmount * 0.1;
    if (yearsDelayed >= 3) return serviceChargeAmount * 0.15;

    return 0;
  };

  // Generate financial year options
  useEffect(() => {
    const allotmentDate = formData.propertyRecord.avantan_dinank;
    if (allotmentDate) {
      const options = generateFinancialYearOptions(allotmentDate);
      setFinancialYearOptions(options);

      if (!formData.serviceCharges[0]?.service_charge_financial_year) {
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          serviceCharges: [
            {
              ...(prevFormData.serviceCharges[0] || {}),
              service_charge_financial_year: options[0],
            },
          ],
        }));
      }
    }
  }, [
    formData.propertyRecord.avantan_dinank,
    formData.serviceCharges,
    setFormData,
  ]);

  // Calculate service charge amount and late fee
  useEffect(() => {
    const floorType = formData.propertyRecord.property_floor_type;
    const serviceChargeAmount =
      floorType === "LGF" ? 10610 : floorType === "UGF" ? 11005 : 0;

    const allotmentFY = getFinancialYearFromDate(
      formData.propertyRecord.avantan_dinank
    );
    const selectedFY =
      formData.serviceCharges[0]?.service_charge_financial_year || allotmentFY;
    const paymentDate = formData.serviceCharges[0]?.service_charge_payment_date;

    const lateFee = paymentDate
      ? calculateServiceChargeLateFee(
          allotmentFY,
          selectedFY,
          paymentDate,
          serviceChargeAmount
        )
      : 0;
    const totalServiceCharge = serviceChargeAmount + lateFee;

    const currentServiceCharge = formData.serviceCharges[0] || {};
    if (
      currentServiceCharge.service_charge_amount !== serviceChargeAmount ||
      currentServiceCharge.service_charge_late_fee !== lateFee ||
      currentServiceCharge.service_charge_total !== totalServiceCharge
    ) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        serviceCharges: [
          {
            ...(prevFormData.serviceCharges[0] || {}),
            service_charge_amount: serviceChargeAmount,
            service_charge_late_fee: lateFee,
            service_charge_total: totalServiceCharge,
          },
        ],
      }));
    }
  }, [
    formData.propertyRecord.property_floor_type,
    formData.propertyRecord.avantan_dinank,
    formData.serviceCharges,
    setFormData,
  ]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({
      ...formData,
      serviceCharges: [
        {
          ...(formData.serviceCharges[0] || {}),
          [fieldId]: value === "" ? null : value,
        },
      ],
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
        Service Charge Details
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Fill in the details for service charges.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mt-4">
        {serviceChargeFields.map((field) => {
          const fieldValue = formData.serviceCharges[0]?.[field.id] || "";
          return (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                )}
              </label>
              {field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  value={fieldValue}
                >
                  <option value="" className="dark:bg-gray-800">
                    Select option...
                  </option>
                  {financialYearOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="dark:bg-gray-800"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "date" ? (
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                  value={fieldValue}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                  value={fieldValue}
                  readOnly={field.readOnly}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
              {errors[field.id] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceChargeStep;