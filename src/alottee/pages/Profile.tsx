import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  LogOut,
  Calendar,
  FileText,
  CreditCard,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("bida_token");
    localStorage.removeItem("bida_phone");
    navigate("/alottee/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const mobileNo = localStorage.getItem("bida_phone");
        if (!mobileNo) {
          throw new Error("Mobile number not found in local storage");
        }

        const response = await fetch(
          `https://apiproperty.bidabhadohi.com/users/by-mobile?page=1&limit=10&yojna_id=BID&mobile_no=${mobileNo}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setProperty(data.data[0]);
        } else {
          throw new Error("No property data found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md flex items-center space-x-4">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading profile data...
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-xl mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p>{error || "Property not found"}</p>
          </div>
          <button
            onClick={() => navigate("/alottee")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg font-medium text-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Compute installment plan details
  const paidAmount = property.installments
    .filter((inst) => inst.status === "initiated")
    .reduce((sum, inst) => sum + parseFloat(inst.payment_amount), 0);
  const remainingBalance =
    parseFloat(property.propertyRecordDetail.kul_yog) - paidAmount;
  const numberOfInstallmentsPaid = property.installments.filter(
    (inst) => inst.status === "initiated"
  ).length;

  const installmentPlan = {
    kul_yog: property.propertyRecordDetail.kul_yog,
    paid_amount: paidAmount.toFixed(2),
    remaining_balance: remainingBalance.toFixed(2),
    interest_rate: property.propertyRecordDetail.interest_rate,
    number_of_installment_paid: numberOfInstallmentsPaid,
    ideal_number_of_installments:
      property.propertyRecordDetail.ideal_number_of_installments,
    ideal_kisht_mool: property.propertyRecordDetail.ideal_kisht_mool,
  };

  // Calculate EMI Progress
  const emiProgress =
    (numberOfInstallmentsPaid /
      parseInt(installmentPlan.ideal_number_of_installments)) *
    100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/alottee")}
              className="p-2 hover:bg-gray-100 rounded-full mr-4 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Profile Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={40} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold truncate">
                      {property.propertyRecords.avanti_ka_naam}
                    </h2>
                    <p className="flex items-center mt-2 text-blue-100">
                      <Phone size={16} className="mr-2" />
                      {property.propertyRecords.mobile_no}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Father's/Husband's Name
                    </p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecords.pita_pati_ka_naam}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Permanent Address</p>
                    <div className="flex">
                      <MapPin
                        size={18}
                        className="text-gray-400 mr-2 flex-shrink-0 mt-1"
                      />
                      <p className="font-medium text-gray-800">
                        {property.propertyRecords.avanti_ka_sthayi_pata}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EMI Progress Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  EMI Progress
                </h3>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm text-gray-500">Completed</span>
                  <span className="text-sm font-medium">
                    {installmentPlan.number_of_installment_paid} of{" "}
                    {installmentPlan.ideal_number_of_installments} EMIs
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${emiProgress}%` }}
                  ></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Paid Amount</p>
                    <p className="text-lg font-bold text-green-700">
                      ₹
                      {parseFloat(installmentPlan.paid_amount).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-lg font-bold text-amber-700">
                      ₹
                      {parseFloat(
                        installmentPlan.remaining_balance
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Property Details and Records */}
          <div className="lg:col-span-2">
            {/* Property Details Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Property Details
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Property ID</p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecords.property_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheme</p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecords.yojna_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecordDetail.sampatti_sreni}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Number</p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecordDetail.avanti_sampatti_sankhya}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Floor Type</p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecordDetail.property_floor_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Possession Date</p>
                    <p className="font-medium text-gray-800">
                      {property.propertyRecords.kabja_dinank || "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Installment Plan Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Installment Plan
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 p-5 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total Amount (कुल योग)
                      </p>
                      <p className="text-3xl font-bold text-blue-700 mt-1">
                        ₹
                        {parseFloat(installmentPlan.kul_yog).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                    <div className="bg-blue-100 px-4 py-2 rounded-lg">
                      <p className="text-sm text-blue-600">
                        Interest Rate:{" "}
                        <span className="font-bold">
                          {installmentPlan.interest_rate}%
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <p className="text-gray-700">Interest Rate</p>
                    <p className="font-medium">
                      {installmentPlan.interest_rate}%
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <p className="text-gray-700">EMIs Paid</p>
                    <p className="font-medium">
                      {installmentPlan.number_of_installment_paid} of{" "}
                      {installmentPlan.ideal_number_of_installments}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <p className="text-gray-700">EMI Amount</p>
                    <p className="font-medium">
                      ₹
                      {parseFloat(
                        installmentPlan.ideal_kisht_mool
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs for Payment History */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment History
                  </h3>
                </div>
              </div>

              {/* Paid Installments */}
              {property.installments.length > 0 && (
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Paid Installments
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                            No.
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                            Date
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">
                            Amount
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {property.installments.map((installment, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              {installment.payment_number}
                            </td>
                            <td className="py-3 px-4">
                              {installment.payment_date}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              ₹
                              {parseFloat(
                                installment.payment_amount
                              ).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {installment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Service Charges */}
              {property.serviceCharges.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Service Charges
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                            Year
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">
                            Amount
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">
                            Payment Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {property.serviceCharges.map((charge, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              {charge.service_charge_financial_year}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              ₹
                              {parseFloat(
                                charge.service_charge_amount
                              ).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {charge.service_charge_payment_date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {property.installments.length === 0 &&
                property.serviceCharges.length === 0 && (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No payment records found</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BIDA Property Management. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

export default Profile;
