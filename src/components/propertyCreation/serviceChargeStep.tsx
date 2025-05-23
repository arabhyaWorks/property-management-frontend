import React, { useState, useEffect, useMemo } from "react";

interface ServiceChargeStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

// Utility Functions (Calculation Logic Unchanged)
const getFinancialYearFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 3 = Apr
  return month < 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
};

const generateBilledYears = (
  allotmentDate: string,
  currentDate: string
): string[] => {
  const allotmentFY = getFinancialYearFromDate(allotmentDate);
  const [startYear] = allotmentFY.split("-").map(Number);
  const currentFY = getFinancialYearFromDate(currentDate);
  const [endYear] = currentFY.split("-").map(Number);
  const years = [];
  for (let year = startYear + 1; year <= endYear; year++) {
    years.push(`${year}-${year + 1}`);
  }
  return years;
};

const getEndYear = (fy: string): number => {
  const [, end] = fy.split("-");
  return Number(end);
};

const calculateLateFee = (
  serviceChargeFY: string,
  paymentDate: string,
  baseAmount: number
): number => {
  if (!paymentDate) return 0;
  const serviceChargeEndYear = getEndYear(serviceChargeFY);
  const paymentFY = getFinancialYearFromDate(paymentDate);
  const paymentEndYear = getEndYear(paymentFY);
  const diff = paymentEndYear - serviceChargeEndYear;
  if (diff <= 0) return 0;
  const percentage =
    diff === 1 ? 0.05 : diff === 2 ? 0.1 : diff >= 3 ? 0.15 : 0;
  return baseAmount * percentage;
};

const ServiceChargeStep: React.FC<ServiceChargeStepProps> = ({
  formData,
  setFormData,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [billedYears, setBilledYears] = useState<string[]>([]);

  // property_floor_type and avantan_dinank now come from propertyRecordDetail
  const floorType = formData.propertyRecordDetail?.property_floor_type || "";
  const allotmentDate = formData.propertyRecordDetail?.avantan_dinank || "";

  // Base amount depends on floorType
  const baseAmount =
    floorType === "LGF" ? 10610 : floorType === "UGF" ? 11005 : 0;

  // Generate the list of financial years that should be billed, based on the allotment date → current date
  useEffect(() => {
    if (allotmentDate) {
      const currentDate = new Date().toISOString().split("T")[0];
      const years = generateBilledYears(allotmentDate, currentDate);
      setBilledYears(years);
    }
  }, [allotmentDate]);

  // Filter out any years already used in formData.serviceCharges
  const availableYears = useMemo(() => {
    return billedYears.filter(
      (year) =>
        !formData.serviceCharges.some(
          (charge: any) => charge.service_charge_financial_year === year
        )
    );
  }, [billedYears, formData.serviceCharges]);

  // Automatically pick the first available year if none is selected
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Calculate late fee based on the chosen year + payment date
  const lateFee = useMemo(() => {
    return selectedYear && paymentDate
      ? calculateLateFee(selectedYear, paymentDate, baseAmount)
      : 0;
  }, [selectedYear, paymentDate, baseAmount]);

  // Combined total
  const total = baseAmount + lateFee;

  // When user clicks "Add Service Charge"
  const handleAdd = () => {
    const newServiceCharge = {
      service_charge_financial_year: selectedYear,
      service_charge_amount: baseAmount,
      service_charge_late_fee: lateFee,
      service_charge_payment_date: paymentDate,
    };
    setFormData({
      ...formData,
      serviceCharges: [...formData.serviceCharges, newServiceCharge],
    });
    setSelectedYear("");
    setPaymentDate("");
  };

  return (
    <div className="rounded-lg mx-auto">
      {/* Select Financial Year */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">वित्तीय वर्ष</label>
        <select
          className="w-full p-2 border border-gray-300 rounded text-black"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">वर्ष चुनें</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">भुगतान तिथि</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded text-black"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      {/* Summary of Amounts */}
      <div className="bg-white text-black p-4 rounded-lg shadow-md mb-4">
        <p className="mb-1">
          <strong>मूल राशि:</strong> {baseAmount.toFixed(2)}
        </p>
        <p className="mb-1">
          <strong>विलंब शुल्क:</strong> {lateFee.toFixed(2)}
        </p>
        <p className="text-lg font-semibold">
          <strong>कुल:</strong> {total.toFixed(2)}
        </p>
      </div>

      {/* Add Service Charge Button */}
      <button
        className="w-full bg-blue-200 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
        onClick={handleAdd}
        disabled={!selectedYear || !paymentDate}
      >
        सेवा शुल्क जोड़ें
      </button>

      {/* Display All Added Service Charges */}
      {formData.serviceCharges.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">जोड़े गए सेवा शुल्क</h4>
          <table className="w-full text-left bg-white text-black rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2">वित्तीय वर्ष</th>
                <th className="p-2">मूल राशि</th>
                <th className="p-2">विलंब शुल्क</th>
                <th className="p-2">भुगतान तिथि</th>
                <th className="p-2">कुल</th>
              </tr>
            </thead>
            <tbody>
              {formData.serviceCharges.map((charge: any, index: number) => {
                const totalCharge =
                  charge.service_charge_amount + charge.service_charge_late_fee;
                return (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-2">
                      {charge.service_charge_financial_year}
                    </td>
                    <td className="p-2">
                      {parseInt(charge.service_charge_amount).toFixed(2)}
                    </td>
                    <td className="p-2">
                      {parseInt(charge.service_charge_late_fee).toFixed(2)}
                    </td>
                    <td className="p-2">
                      {charge.service_charge_payment_date}
                    </td>
                    <td className="p-2 font-semibold">
                      {parseInt(totalCharge).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceChargeStep;
