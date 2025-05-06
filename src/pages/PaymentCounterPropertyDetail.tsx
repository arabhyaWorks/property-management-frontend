import React, { useState, useEffect } from "react";
import { ArrowLeft, Building, Calendar, FileText, Landmark, ReceiptText, Wallet } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import BASE_URL from "../data/endpoint";

// Define the Property interface
interface PropertyRecord {
  record_id: number;
  property_unique_id: string;
  yojna_id: string;
  yojna_name: string;
  avanti_ka_naam: string;
  sampatti_sreni: string;
  avanti_sampatti_sankhya?: string;
  avantan_dinank: string;
  auction_keemat?: string;
  avshesh_vikray_mulya_ekmusht_jama_dhanrashi?: string;
}

interface InstallmentPlan {
  kul_yog: string;
  paid_amount: string;
  remaining_balance: string;
  ideal_kisht_mool: string;
  ideal_kisht_byaj: string;
  next_due_date: string;
  number_of_installment_paid: number;
  ideal_number_of_installments: number;
  first_installment_due_date: string;
  late_fee_per_day: string;
}

interface Installment {
  payment_id: string;
  property_id: string;
  property_record_id: number;
  user_id: number;
  user_role: string;
  user_name: string;
  status: string;
  payment_number: number;
  payment_amount: string;
  kisht_mool_paid: string;
  kisht_byaj_paid: string;
  payment_due_date: string;
  payment_date: string;
  number_of_days_delayed: number;
  late_fee_amount: string;
  total_payment_amount_with_late_fee: string;
}

interface ServiceCharge {
  service_charge_id: string;
  property_id: string;
  property_record_id: number;
  user_id: number;
  user_role: string;
  user_name: string;
  status: string;
  service_charge_financial_year: string;
  service_charge_amount: string;
  service_charge_late_fee: string;
  service_charge_payment_date: string;
}

interface PropertyData {
  propertyRecord: PropertyRecord;
  installmentPlan: InstallmentPlan;
  installments: Installment[];
  serviceCharges: ServiceCharge[];
}

const getFinancialYearFromDate = (dateString: string): string => {
  const [day, month, year] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  const yearNum = date.getFullYear();
  const monthNum = date.getMonth(); // 0 = Jan, 3 = Apr
  return monthNum < 3
    ? `${yearNum - 1}-${yearNum}`
    : `${yearNum}-${yearNum + 1}`;
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

// Helper function for next installment due date
function getNextInstallmentDueDate(
  firstInstallmentDate: string,
  installmentsPaid: number
): string {
  try {
    const [dayStr, monthStr, yearStr] = firstInstallmentDate.split("-");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const dateObj = new Date(year, month - 1, day);
    const monthsToAdd = 3 * installmentsPaid;
    dateObj.setMonth(dateObj.getMonth() + monthsToAdd);

    const newDay = String(dateObj.getDate()).padStart(2, "0");
    const newMon = String(dateObj.getMonth() + 1).padStart(2, "0");
    const newYr = String(dateObj.getFullYear());

    return `${newDay}-${newMon}-${newYr}`;
  } catch {
    console.log("Error in date calculation");
    return "N/A";
  }
}

function PropertyDetails({ property }: { property: PropertyData }) {
  const navigate = useNavigate();
  const [nextDueDate, setNextDueDate] = useState("N/A");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!property) {
      setError("Property data not found");
      return;
    }

    const {
      first_installment_due_date,
      number_of_installment_paid,
      ideal_number_of_installments,
    } = property.installmentPlan;

    if (number_of_installment_paid >= ideal_number_of_installments) {
      setNextDueDate("All installments paid");
    } else {
      const computedDate = getNextInstallmentDueDate(
        first_installment_due_date,
        number_of_installment_paid
      );
      setNextDueDate(computedDate);
    }
  }, [property]);

  if (error || !property) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-xl">{error || "Property not found"}</p>
          <button
            onClick={() => navigate("/payment-counter")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { propertyRecord, installmentPlan, installments, serviceCharges } = property;

  const {
    kul_yog,
    paid_amount,
    remaining_balance,
    ideal_kisht_mool,
    ideal_number_of_installments,
    number_of_installment_paid,
  } = installmentPlan;

  const totalAmount = parseFloat(kul_yog);
  const totalPaid = parseFloat(paid_amount);
  const totalRemaining = parseFloat(remaining_balance);
  const nextEMIAmount = parseFloat(ideal_kisht_mool);

  const installmentsPaid = number_of_installment_paid;
  const totalEmis = ideal_number_of_installments;

  const getCurrentDate = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const [year, month, day] = currentDate.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  // Service Charge Status Calculation
  const getServiceChargeStatus = () => {
    const allotmentDate = propertyRecord.avantan_dinank;
    const currentDate = getCurrentDate();
    const billedYears = generateBilledYears(allotmentDate, currentDate);
    const firstPayableFY = billedYears[0] || "N/A";

    const paidYears = serviceCharges.map(
      (charge) => charge.service_charge_financial_year
    );
    const unpaidYears = billedYears.filter((year) => !paidYears.includes(year));

    return { firstPayableFY, paidYears, unpaidYears };
  };

  const { firstPayableFY, paidYears, unpaidYears } = getServiceChargeStatus();

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white px-8 py-4 flex items-center shadow-md">
        <button
          onClick={() => navigate("/payment-counter")}
          className="p-2 hover:bg-gray-100 rounded-full mr-4 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Property Details</h1>
      </div>

      <div className="max-w-6xl mx-auto pt-8 px-6">
        {installmentPlan?.kul_yog === "0.00" ||
        installmentPlan?.kul_yog === "0" ||
        installmentPlan?.kul_yog === "0.0" ||
        installmentPlan?.kul_yog == null ? (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            {/* Property Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {propertyRecord.sampatti_sreni}
                    </h3>
                    {propertyRecord.avanti_sampatti_sankhya && (
                      <h3 className="text-2xl font-bold text-gray-900">
                        - {propertyRecord.avanti_sampatti_sankhya}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-base font-medium">
                      {propertyRecord.yojna_id}
                    </span>
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-base">
                      {propertyRecord.property_unique_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Landmark className="text-gray-500" size={22} />
                  <p className="text-base text-gray-600">नीलामी धनराशि</p>
                </div>
                <p className="font-bold text-2xl text-gray-900">
                  ₹
                  {propertyRecord?.auction_keemat
                    ? Math.round(
                        parseFloat(propertyRecord.auction_keemat)
                      ).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>
              <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <ReceiptText className="text-green-600" size={22} />
                  <p className="text-base text-gray-600">
                    अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि
                  </p>
                </div>
                <p className="font-bold text-2xl text-green-700">
                  ₹
                  {propertyRecord?.avshesh_vikray_mulya_ekmusht_jama_dhanrashi
                    ? Math.round(
                        parseFloat(
                          propertyRecord.avshesh_vikray_mulya_ekmusht_jama_dhanrashi
                        )
                      ).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Property Card */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 h-full">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {propertyRecord.sampatti_sreni}
                        {propertyRecord.avanti_sampatti_sankhya
                          ? ` - ${propertyRecord.avanti_sampatti_sankhya}`
                          : ""}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-base font-medium">
                          {propertyRecord.yojna_id}
                        </span>
                        <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-base">
                          {propertyRecord.property_unique_id}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                        <FileText size={22} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <Landmark className="text-gray-500" size={22} />
                        <p className="text-base text-gray-600">कुल योग</p>
                      </div>
                      <p className="font-bold text-2xl text-gray-900">
                        ₹{Math.round(totalAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                      <div className="flex items-center gap-3 mb-3">
                        <ReceiptText className="text-green-600" size={22} />
                        <p className="text-base text-gray-600">कुल जमा धनराशी</p>
                      </div>
                      <p className="font-bold text-2xl text-green-700">
                        ₹{Math.round(totalPaid).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet className="text-red-500" size={22} />
                        <p className="text-base text-gray-600">शेष धनराशी</p>
                      </div>
                      <p className="font-bold text-2xl text-red-700">
                        ₹{Math.round(totalRemaining).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* EMI Progress */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg text-gray-700 font-medium">EMI Progress</span>
                      <span className="font-medium text-lg">
                        {installmentsPaid} of {totalEmis} EMIs
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${(installmentsPaid / totalEmis) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {Math.round((installmentsPaid / totalEmis) * 100)}% complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next EMI Section */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar size={22} className="text-blue-600" />
                    Next EMI Due
                  </h3>
                </div>

                {installmentsPaid >= totalEmis ? (
                  <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100 my-8">
                    <p className="text-lg text-green-700 font-medium">All installments are paid!</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col mb-6 space-y-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-sm mb-1">Amount</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ₹{nextEMIAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl">
                        <p className="text-gray-500 text-sm mb-1">Due Date</p>
                        <p className="text-xl font-bold text-red-600">
                          {nextDueDate || "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate("/payment-counter/property/pay-emi", {
                          state: {
                            property,
                            nextDueDate,
                          },
                        })
                      }
                      className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
                    >
                      Pay EMI
                    </button>

                    <div className="flex justify-between items-center mt-4 text-gray-600">
                      <p className="text-sm">
                        Installments paid: {installmentsPaid} of {totalEmis}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Service Charge Status Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Building size={24} className="text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                Service Charge Status
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-600 font-medium mb-2">
                    <strong>पहला देय वित्तीय वर्ष</strong>
                  </p>
                  <p className="text-lg font-bold text-gray-900">{firstPayableFY}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-6">
                  {paidYears.length > 0 && (
                    <div>
                      <p className="text-gray-700 font-medium mb-3">
                        भुगतान किए गए वर्ष:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {paidYears.map((year) => (
                          <span
                            key={year}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                          >
                            {year}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {unpaidYears.length > 0 && (
                    <div>
                      <p className="text-gray-700 font-medium mb-3">
                        पेंडिंग सर्विस चार्ज:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {unpaidYears.map((year) => (
                          <span
                            key={year}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
                          >
                            {year}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(paidYears.length > 0 || unpaidYears.length > 0) && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() =>
                    navigate("/payment-counter/property/service-charges", {
                      state: { property },
                    })
                  }
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
                >
                  Manage Service Charges
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCounterPropertyDetail() {
  const { property_id } = useParams(); // Get property_id from URL
  const navigate = useNavigate();
  const [property, setProperty] = useState<any[]>([]); // To store the transformed property data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch property details on component mount
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/properties/${property_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const responseData = await response.json();
        if (responseData.propertyRecords && responseData.propertyRecords.length > 0) {
          const transformedProperties = responseData.propertyRecords.map((item, index) => {
            const propertyRecord = {
              record_id: item.id,
              property_unique_id: item.property_id,
              avanti_sampatti_sankhya: responseData.propertyRecordDetail.avanti_sampatti_sankhya,
              user_id: item.user_id,
              yojna_id: item.yojna_id,
              yojna_name: item.yojna_name,
              avanti_ka_naam: item.avanti_ka_naam,
              sampatti_sreni: responseData.propertyRecordDetail.sampatti_sreni,
              avantan_dinank: responseData.propertyRecordDetail.avantan_dinank,
              property_floor_type: responseData.propertyRecordDetail.property_floor_type,
              auction_keemat: responseData.propertyRecordDetail.auction_keemat,
              avshesh_vikray_mulya_ekmusht_jama_dhanrashi:
                responseData.propertyRecordDetail.avshesh_vikray_mulya_ekmusht_jama_dhanrashi,
            };

            const paidInstallments = responseData.installments.filter(
              (inst: any) => inst.status === "paid"
            );

            const serviceCharges = responseData.serviceCharges.filter(
              (charge: any) => charge.status === "paid"
            );

            const number_of_installment_paid = paidInstallments.length;
            const paid_amount =
              number_of_installment_paid *
              parseFloat(responseData.propertyRecordDetail.ideal_installment_amount_per_installment);

            const kul_yog = parseFloat(responseData.propertyRecordDetail.kul_yog);
            const remaining_balance = (kul_yog - paid_amount).toFixed(2);

            const initialDueDate = new Date(
              responseData.propertyRecordDetail.first_installment_due_date
            );
            const nextDueDate = new Date(initialDueDate);
            nextDueDate.setMonth(
              nextDueDate.getMonth() + 3 * number_of_installment_paid
            );

            const day = String(nextDueDate.getDate()).padStart(2, "0");
            const month = String(nextDueDate.getMonth() + 1).padStart(2, "0");
            const year = nextDueDate.getFullYear();
            const next_due_date = `${day}-${month}-${year}`;

            const installmentPlan = {
              kul_yog: responseData.propertyRecordDetail.kul_yog,
              paid_amount: paid_amount.toFixed(2),
              remaining_balance,
              ideal_kisht_mool: responseData.propertyRecordDetail.ideal_kisht_mool,
              ideal_kisht_byaj: responseData.propertyRecordDetail.ideal_kisht_byaj,
              next_due_date,
              number_of_installment_paid,
              ideal_number_of_installments:
                responseData.propertyRecordDetail.ideal_number_of_installments,
              first_installment_due_date:
                responseData.propertyRecordDetail.first_installment_due_date,
              late_fee_per_day: responseData.propertyRecordDetail.late_fee_per_day,
            };

            return {
              propertyRecord,
              installmentPlan,
              serviceCharges,
              installments: paidInstallments,
            };
          });

          setProperty(transformedProperties);
        } else {
          setError("No property data found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property_id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-blue-600 font-semibold text-xl">
            Loading...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
            <p className="text-red-500 font-medium">Error: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (property.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-blue-200 border border-blue-200 rounded-lg p-6 shadow-md">
            <p className="text-blue-600 font-medium">No data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Use the latest property record (the active one with next_record_id = null)
  const latestProperty = property.find((p) => p.propertyRecord.next_record_id === null) || property[property.length - 1];

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <PropertyDetails property={latestProperty} />
    </DashboardLayout>
  );
}