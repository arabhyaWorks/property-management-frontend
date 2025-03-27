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

const generateBilledYears = (allotmentDate: string, currentDate: string): string[] => {
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

const calculateLateFee = (serviceChargeFY: string, paymentDate: string, baseAmount: number): number => {
  if (!paymentDate) return 0;
  const serviceChargeEndYear = getEndYear(serviceChargeFY);
  const paymentFY = getFinancialYearFromDate(paymentDate);
  const paymentEndYear = getEndYear(paymentFY);
  const diff = paymentEndYear - serviceChargeEndYear;
  if (diff <= 0) return 0;
  const percentage = diff === 1 ? 0.05 : diff === 2 ? 0.1 : diff >= 3 ? 0.15 : 0;
  return baseAmount * percentage;
};



const ServiceChargeStep: React.FC<ServiceChargeStepProps> = ({ formData, setFormData }) => {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [paymentDate, setPaymentDate] = useState<string>("");
    const [billedYears, setBilledYears] = useState<string[]>([]);
  
    const floorType = formData.propertyRecord.property_floor_type;
    const baseAmount = floorType === "LGF" ? 10610 : floorType === "UGF" ? 11005 : 0;
  
    useEffect(() => {
      const allotmentDate = formData.propertyRecord.avantan_dinank;
      const currentDate = new Date().toISOString().split("T")[0];
      if (allotmentDate) {
        const years = generateBilledYears(allotmentDate, currentDate);
        setBilledYears(years);
      }
    }, [formData.propertyRecord.avantan_dinank]);
  
    const availableYears = useMemo(() => {
      return billedYears.filter(
        (year) => !formData.serviceCharges.some((charge: any) => charge.service_charge_financial_year === year)
      );
    }, [billedYears, formData.serviceCharges]);
  
    useEffect(() => {
      if (availableYears.length > 0 && !selectedYear) {
        setSelectedYear(availableYears[0]);
      }
    }, [availableYears]);
  
    const lateFee = useMemo(() => {
      return selectedYear && paymentDate ? calculateLateFee(selectedYear, paymentDate, baseAmount) : 0;
    }, [selectedYear, paymentDate, baseAmount]);
  
    const total = baseAmount + lateFee;
  
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
      <div className=" rounded-lg  mx-auto">

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Financial Year</label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Payment Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>
  
        <div className="bg-white text-black p-4 rounded-lg shadow-md mb-4">
          <p className="mb-1"><strong>Base Amount:</strong> {baseAmount.toFixed(2)}</p>
          <p className="mb-1"><strong>Late Fee:</strong> {lateFee.toFixed(2)}</p>
          <p className="text-lg font-semibold"><strong>Total:</strong> {total.toFixed(2)}</p>
        </div>
  
        <button
          className="w-full bg-blue-200 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
          onClick={handleAdd}
          disabled={!selectedYear || !paymentDate}
        >
          Add Service Charge
        </button>
  
        {formData.serviceCharges.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Added Service Charges</h4>
            <table className="w-full text-left bg-white text-black rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-2">Financial Year</th>
                  <th className="p-2">Base Amount</th>
                  <th className="p-2">Late Fee</th>
                  <th className="p-2">Payment Date</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {formData.serviceCharges.map((charge: any, index: number) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-2">{charge.service_charge_financial_year}</td>
                    <td className="p-2">{charge.service_charge_amount.toFixed(2)}</td>
                    <td className="p-2">{charge.service_charge_late_fee.toFixed(2)}</td>
                    <td className="p-2">{charge.service_charge_payment_date}</td>
                    <td className="p-2 font-semibold">{(charge.service_charge_amount + charge.service_charge_late_fee).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

export default ServiceChargeStep;