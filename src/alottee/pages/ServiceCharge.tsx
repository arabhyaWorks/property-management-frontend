import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Home, 
  Wallet, 
  FileText, 
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Building,
  CreditCard,
  DollarSign,
  Clock
} from "lucide-react";
import newBaseEndpoint from "../services/enpoints";

// Interfaces
interface PropertyRecord {
  property_unique_id: string;
  yojna_id: string;
  yojna_name: string;
  avanti_ka_naam: string;
  sampatti_sreni: string;
  avantan_dinank: string; // "DD-MM-YYYY"
  property_floor_type: string; // "LGF" or "UGF"
  user_id: number;
  record_id: number;
}

interface ServiceCharge {
  service_charge_financial_year: string;
  service_charge_amount: string;
  service_charge_late_fee: string;
  service_charge_payment_date: string;
}

interface PropertyData {
  propertyRecord: PropertyRecord;
  serviceCharges: ServiceCharge[];
}

// Utility Functions
const getFinancialYearFromDate = (dateString: string): string => {
  const [day, month, year] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const fiscalYear =
    date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
  return `${fiscalYear}-${fiscalYear + 1}`;
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

const getEndYear = (fy: string): number => Number(fy.split("-")[1]);

const calculateLateFee = (
  serviceChargeFY: string,
  paymentDate: string,
  baseAmount: number
): number => {
  const serviceChargeEndYear = getEndYear(serviceChargeFY);
  const paymentFY = getFinancialYearFromDate(paymentDate);
  const paymentEndYear = getEndYear(paymentFY);
  const diff = paymentEndYear - serviceChargeEndYear;
  if (diff <= 0) return 0;
  const percentage =
    diff === 1 ? 0.05 : diff === 2 ? 0.1 : diff >= 3 ? 0.15 : 0;
  return baseAmount * percentage;
};

const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ServiceCharges: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property as PropertyData;
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!property) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-xl">Property data not found</p>
          <button
            onClick={() => navigate("/property/home")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { propertyRecord, serviceCharges } = property;
  const baseAmount =
    propertyRecord.property_floor_type === "LGF" ? 10610 : 11005;
  const currentDate = formatDateToDDMMYYYY(new Date());
  const paymentDate = currentDate;
  const billedYears = generateBilledYears(
    propertyRecord.avantan_dinank,
    currentDate
  );
  const firstPayableFY = billedYears[0] || "N/A";

  const paidYears = serviceCharges.map(
    (charge) => charge.service_charge_financial_year
  );
  const unpaidYears = billedYears.filter((year) => !paidYears.includes(year));

  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      }
      const earliestUnpaidYear = unpaidYears[0];
      const selectedIndex = unpaidYears.indexOf(year);
      if (prev.length === 0 && year === earliestUnpaidYear) {
        return [year];
      }
      if (prev.length > 0) {
        const lastSelected = prev[prev.length - 1];
        const lastIndex = unpaidYears.indexOf(lastSelected);
        if (selectedIndex === lastIndex + 1) {
          return [...prev, year];
        }
      }
      return prev;
    });
  };

  const paymentBreakdown = useMemo(() => {
    const breakdown = selectedYears.map((year) => {
      const lateFee = calculateLateFee(year, paymentDate, baseAmount);
      const total = baseAmount + lateFee;
      return { year, baseAmount, lateFee, total };
    });
    const totalBase = breakdown.reduce((sum, item) => sum + item.baseAmount, 0);
    const totalLateFees = breakdown.reduce(
      (sum, item) => sum + item.lateFee,
      0
    );
    const grandTotal = totalBase + totalLateFees;
    return { breakdown, totalBase, totalLateFees, grandTotal };
  }, [selectedYears, paymentDate, baseAmount]);

  const handlePay = async () => {
    if (selectedYears.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("bida_token");
      if (!token) throw new Error("Authentication token not found");

      const serviceChargesForRequest = selectedYears.map((year) => {
        const lateFee = calculateLateFee(year, paymentDate, baseAmount);
        return {
          property_id: propertyRecord.property_unique_id,
          property_record_id: propertyRecord.record_id,
          user_id: propertyRecord.user_id,
          service_charge_financial_year: year,
          service_charge_amount: baseAmount.toFixed(2),
          service_charge_late_fee: lateFee.toFixed(2),
          service_charge_payment_date: paymentDate,
        };
      });

      const totalAmount = paymentBreakdown.grandTotal.toFixed(2);
      const orderId = `SC-${Date.now()}`;

      const transaction = {
        payment_type: "serviceCharges",
        orderId,
        amount: totalAmount,
        property_id: propertyRecord.property_unique_id,
        user_id: propertyRecord.user_id,
        processed_by: propertyRecord.user_id,
        payment_method_type: "upi",
        transaction_error_type: null,
        auth_status: null,
      };

      const payload = {
        serviceCharges: serviceChargesForRequest,
        transactions: [transaction],
      };

      console.log(payload);

      const response = await fetch(`${newBaseEndpoint}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      // Redirect to payment gateway
      handleRedirect(orderId, totalAmount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = (orderId: string, amount: string) => {
    const url = "https://emd.bidabhadohi.com/propertyMartPayment/payment";
    const data = {
      order_id: orderId,
      // amount: amount,
      amount: 2,
      customer_name: propertyRecord.avanti_ka_naam || "Unknown",
      customer_email: "customer@example.com", // Replace with actual if available
      customer_mobile: "8800218342", // Replace with actual if available
      customer_address: "Unknown", // Replace with actual if available
      property_id: propertyRecord.property_unique_id,
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    Object.keys(data).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white px-8 py-4 flex items-center shadow-md">
        <button
          onClick={() => navigate("/property/home")}
          className="p-2 hover:bg-gray-100 rounded-full mr-4 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Service Charges</h1>
      </div>

      <div className="max-w-6xl mx-auto pt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Property Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Building size={24} className="text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">Property Info</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {propertyRecord.sampatti_sreni}
                  </h3>
                  <div className="mt-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm inline-block">
                    {propertyRecord.property_unique_id}
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={18} className="text-gray-500" />
                    <p className="text-gray-700">
                      <strong>First Payable FY:</strong> {firstPayableFY}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-500" />
                    <p className="text-gray-700">
                      <strong>Payment Date:</strong> {paymentDate}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Floor Type: <span className="font-semibold">{propertyRecord.property_floor_type}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Base Service Charge: <span className="font-semibold">₹{baseAmount.toLocaleString("en-IN")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charges Status */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              {/* Paid Years */}
              {paidYears.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={22} className="text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-800">Paid Years</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {paidYears.map((year) => (
                      <span
                        key={year}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-base font-medium"
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unpaid Years or All Paid Message */}
              {unpaidYears.length > 0 ? (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle size={22} className="text-amber-500" />
                    <h3 className="text-xl font-semibold text-gray-800">Unpaid Years</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unpaidYears.map((year, index) => (
                      <div 
                        key={year} 
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          selectedYears.includes(year) ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(year)}
                            onChange={() => handleYearToggle(year)}
                            disabled={
                              index > 0 &&
                              !selectedYears.includes(unpaidYears[index - 1]) &&
                              unpaidYears[0] !== year
                            }
                            className="form-checkbox h-5 w-5 text-blue-600 rounded"
                          />
                          <div className="flex justify-between w-full">
                            <span className="text-base font-medium text-gray-800">{year}</span>
                            <span className="text-base font-medium text-gray-700">
                              ₹{baseAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center justify-center gap-3 py-8">
                    <CheckCircle size={28} className="text-green-600" />
                    <p className="text-xl text-green-700 font-medium">
                      All service charges are paid.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600 text-center">
                  {error}
                </div>
              )}

              {/* Payment Breakdown */}
              {selectedYears.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard size={22} className="text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-800">Payment Breakdown</h3>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
                    <div className="space-y-3">
                      {paymentBreakdown.breakdown.map((item) => (
                        <div key={item.year} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100 last:border-0">
                          <div className="font-medium text-gray-800">{item.year}</div>
                          <div className="text-gray-600">
                            Base: ₹{item.baseAmount.toLocaleString("en-IN")}
                            {item.lateFee > 0 && (
                              <span className="ml-2 text-red-500">
                                +₹{item.lateFee.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <div className="text-right font-medium">
                            ₹{item.total.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-gray-600">
                          Base Amount:
                        </div>
                        <div className="text-right font-medium">
                          ₹{paymentBreakdown.totalBase.toLocaleString("en-IN")}
                        </div>
                        
                        <div className="text-gray-600">
                          Late Fees:
                        </div>
                        <div className="text-right font-medium">
                          ₹{paymentBreakdown.totalLateFees.toLocaleString("en-IN")}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                        <span className="text-xl font-bold text-blue-700">
                          ₹{paymentBreakdown.grandTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePay}
                    disabled={isLoading || selectedYears.length === 0}
                    className={`w-full py-4 rounded-lg font-medium text-lg transition-colors ${
                      isLoading || selectedYears.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? "Processing..." : `Pay Service Charges (₹${paymentBreakdown.grandTotal.toLocaleString("en-IN")})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCharges;