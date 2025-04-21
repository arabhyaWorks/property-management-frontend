import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Home,
  Wallet,
  FileText,
  User,
  ChevronRight,
  Calendar,
  CreditCard,
  Building,
  Shield,
  Layers,
  CheckCircle,
  XCircle,
} from "lucide-react";
import newBaseEndpoint from "../services/enpoints";

interface Property {
  propertyRecord: {
    property_unique_id: string;
    yojna_id: string;
    avanti_ka_naam: string;
    sampatti_sreni: string;
    avantan_dinank: string;
    property_floor_type: string;
    avanti_sampatti_sankhya: string;
    auction_keemat: string;
    avshesh_vikray_mulya_ekmusht_jama_dhanrashi: string;
  };
  installmentPlan: {
    kul_yog: string;
    paid_amount: string;
    remaining_balance: string;
    ideal_kisht_mool: string;
    ideal_kisht_byaj: string;
    next_due_date: string | null;
    number_of_installment_paid: number;
    ideal_number_of_installments: number;
  };
  serviceCharges: {
    service_charge_financial_year: string;
    service_charge_amount: string;
    service_charge_late_fee: string;
    service_charge_payment_date: string;
  }[];
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

function PropertyHome() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [propertyData, setPropertyData] = useState<any>({});

  const checkAuth = () => {
    const token = localStorage.getItem("bida_token");
    if (!token) {
      console.log("Token not found at check auth");
      navigate("/login");
      return false;
    }
    return true;
  };

  const fetchPropertyData = async () => {
    setLoading(true);
    setError("");
    try {
      const phone = localStorage.getItem("bida_phone");
      const query = `${newBaseEndpoint}/users/by-mobile?page=1&limit=10&mobile_no=${phone}`;
      
      if (!phone) {
        throw new Error("Phone number not found in local storage");
      }

      const token = localStorage.getItem("bida_token");
      const response = await fetch(query, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || "Failed to fetch properties");
      }

      const responseData = await response.json();
      if (responseData.data && responseData.data.length > 0) {
        const transformedProperties = responseData.data.map((item, index) => {
          const propertyRecord = {
            record_id: item.propertyRecords.id,
            property_unique_id: item.propertyRecords.property_id,
            avanti_sampatti_sankhya:
              item.propertyRecordDetail.avanti_sampatti_sankhya,
            user_id: item.propertyRecords.user_id,
            yojna_id: item.propertyRecords.yojna_id,
            yojna_name: item.propertyRecords.yojna_name,
            avanti_ka_naam: item.propertyRecords.avanti_ka_naam,
            sampatti_sreni: item.propertyRecordDetail.sampatti_sreni,
            avantan_dinank: item.propertyRecordDetail.avantan_dinank,
            property_floor_type: item.propertyRecordDetail.property_floor_type,
            auction_keemat: item.propertyRecordDetail.auction_keemat,
            avshesh_vikray_mulya_ekmusht_jama_dhanrashi:
              item.propertyRecordDetail
                .avshesh_vikray_mulya_ekmusht_jama_dhanrashi,
          };

          const paidInstallments = item.installments.filter(
            (inst: any) => inst.status === "paid"
          );

          // paid service charges
          const serviceCharges = item.serviceCharges.filter(
            (charge: any) => charge.status === "paid"
          );

          const number_of_installment_paid = paidInstallments.length;
          const paid_amount =
            number_of_installment_paid *
            item.propertyRecordDetail.ideal_installment_amount_per_installment;

          const kul_yog = parseFloat(item.propertyRecordDetail.kul_yog);
          const remaining_balance = (kul_yog - parseFloat(paid_amount)).toFixed(
            2
          );
          // Calculate the next due date
          const initialDueDate = new Date(
            item.propertyRecordDetail.first_installment_due_date
          );
          const nextDueDate = new Date(initialDueDate);
          nextDueDate.setMonth(
            nextDueDate.getMonth() + 3 * number_of_installment_paid
          );

          // Format next_due_date as dd-mm-yyyy
          const day = String(nextDueDate.getDate()).padStart(2, "0");
          const month = String(nextDueDate.getMonth() + 1).padStart(2, "0"); // +1 because getMonth() is 0-based
          const year = nextDueDate.getFullYear();
          const next_due_date = `${day}-${month}-${year}`;

          const installmentPlan = {
            kul_yog: item.propertyRecordDetail.kul_yog,
            paid_amount,
            remaining_balance,
            ideal_kisht_mool: item.propertyRecordDetail.ideal_kisht_mool,
            ideal_kisht_byaj: item.propertyRecordDetail.ideal_kisht_byaj,
            next_due_date,
            number_of_installment_paid,
            ideal_number_of_installments:
              item.propertyRecordDetail.ideal_number_of_installments,
            first_installment_due_date:
              item.propertyRecordDetail.first_installment_due_date,
            late_fee_per_day: item.propertyRecordDetail.late_fee_per_day,
          };

          return {
            propertyRecord,
            installmentPlan,
            serviceCharges,
            installments: paidInstallments,
          };
        });

        setProperties(transformedProperties);
      } else {
        setError("No property data found");
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to load property details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkAuth()) {
      fetchPropertyData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getCurrentDate = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const [year, month, day] = currentDate.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  // Service Charge Calculations
  const getServiceChargeStatus = (property: Property) => {
    const allotmentDate = property.propertyRecord.avantan_dinank;
    const currentDate = getCurrentDate();
    const billedYears = generateBilledYears(allotmentDate, currentDate);
    const firstPayableFY = billedYears[0] || "N/A";
    const paidYears = property.serviceCharges.map(
      (charge) => charge.service_charge_financial_year
    );
    const unpaidYears = billedYears.filter((year) => !paidYears.includes(year));

    return { firstPayableFY, paidYears, unpaidYears };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-xl shadow-md bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading your properties...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">
            <XCircle className="mx-auto h-16 w-16" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Unable to Load Data</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchPropertyData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Welcome, {properties[0]?.propertyRecord.avanti_ka_naam || "User"}
                </h1>
                <p className="text-gray-500 text-sm">Property Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={()=>{
                  navigate("/alottee/profile");
                }} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Your Properties</h2>
              <p className="text-gray-600 text-sm">Manage and view your property details</p>
            </div>
            <div className="hidden md:block">
              <div className="px-4 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium">
                {new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const { firstPayableFY, paidYears, unpaidYears } = getServiceChargeStatus(property);
            
            return (
              <div
                key={property.propertyRecord.property_unique_id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => navigate(`/alottee/property/details`, { state: property })}
              >
                {/* Property Header - With gradient background */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">
                          {property.propertyRecord.sampatti_sreni}
                        </h3>
                        <span>-</span>
                        <h3 className="text-xl font-bold">
                          {property.propertyRecord.avanti_sampatti_sankhya}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium flex items-center">
                          <Layers className="w-3 h-3 mr-1" />
                          {property.propertyRecord.yojna_id}
                        </span>
                        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          {property.propertyRecord.property_floor_type}
                        </span>
                      </div>
                      <p className="text-xs text-white text-opacity-90 mt-2 flex items-center">
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                          ID: {property.propertyRecord.property_unique_id}
                        </span>
                      </p>
                    </div>
                    <div className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-5 space-y-5">
                  {property?.installmentPlan?.kul_yog === "0.00" ||
                  property?.installmentPlan?.kul_yog === "0" ||
                  property?.installmentPlan?.kul_yog === "0.0" ||
                  property?.installmentPlan?.kul_yog == null ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <p className="text-sm font-medium text-gray-600">नीलामी धनराशि</p>
                        </div>
                        <p className="font-bold text-xl text-gray-900">
                          ₹
                          {property?.propertyRecord?.auction_keemat
                            ? Math.round(
                                parseFloat(
                                  property.propertyRecord.auction_keemat
                                )
                              ).toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-gray-600">अवशेष विक्रय मूल्य</p>
                        </div>
                        <p className="font-bold text-xl text-green-700">
                          ₹
                          {property?.propertyRecord
                            ?.avshesh_vikray_mulya_ekmusht_jama_dhanrashi
                            ? Math.round(
                                parseFloat(
                                  property.propertyRecord
                                    .avshesh_vikray_mulya_ekmusht_jama_dhanrashi
                                )
                              ).toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Financial Overview Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                            <p className="text-xs font-medium text-gray-600">कुल योग</p>
                          </div>
                          <p className="font-bold text-lg text-gray-900">
                            ₹
                            {Math.round(
                              parseFloat(property.installmentPlan.kul_yog)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <Wallet className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-medium text-gray-600">कुल जमा</p>
                          </div>
                          <p className="font-bold text-lg text-green-700">
                            ₹
                            {Math.round(
                              parseFloat(property.installmentPlan.paid_amount)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-4 h-4 text-red-600" />
                            <p className="text-xs font-medium text-gray-600">शेष धनराशी</p>
                          </div>
                          <p className="font-bold text-lg text-red-700">
                            ₹
                            {Math.round(
                              parseFloat(
                                property.installmentPlan.remaining_balance
                              )
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* EMI Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> EMI Progress
                          </span>
                          <span className="font-medium text-blue-700">
                            {property.installmentPlan.number_of_installment_paid} of{" "}
                            {property.installmentPlan.ideal_number_of_installments}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${
                                (property.installmentPlan.number_of_installment_paid /
                                  property.installmentPlan.ideal_number_of_installments) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        
                        {/* Due Date */}
                        {property.installmentPlan.next_due_date && (
                          <div className="flex justify-end">
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                              Next Due: {property.installmentPlan.next_due_date}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Service Charge Section */}
                  <div className="space-y-3 border-t pt-4 mt-2">
                    <h4 className="font-medium text-gray-800 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" /> Service Charges
                    </h4>
                    
                    <div className="text-sm">
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">पहला देय वित्तीय वर्ष:</span> {firstPayableFY}
                      </p>
                      
                      {/* Paid Years */}
                      {paidYears.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-600 font-medium mb-2">भुगतान किए गए वर्ष:</p>
                          <div className="flex flex-wrap gap-2">
                            {paidYears.map((year) => (
                              <span
                                key={year}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {year}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Unpaid Years */}
                      {unpaidYears.length > 0 && (
                        <div>
                          <p className="text-gray-600 font-medium mb-2">पेंडिंग सर्विस चार्ज:</p>
                          <div className="flex flex-wrap gap-2">
                            {unpaidYears.map((year) => (
                              <span
                                key={year}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                {year}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* No Properties Message */}
        {properties.length === 0 && !loading && !error && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Properties Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any properties registered in our system yet. Please contact the administrator for assistance.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-200 mt-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center md:justify-between items-center flex-wrap">
            <p className="text-gray-500 text-sm">
              © 2025 BIDA Property Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-3 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PropertyHome;