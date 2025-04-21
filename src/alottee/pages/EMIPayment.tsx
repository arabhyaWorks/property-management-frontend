import React, { useEffect, useState } from "react";
import { ArrowLeft, Building2, Calendar, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import newBaseEndpoint from "../services/enpoints";

function EMIPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { property, nextDueDate } = location.state || {};
  const { propertyRecord, installmentPlan, installments } = property || {};

  // Calculate the next installment number
  const nextInstallmentNumber =
    (installmentPlan?.number_of_installment_paid || 0) + 1;

  // Calculate due date based on installment number
  const calculateDueDate = () => {
    if (!installmentPlan?.first_installment_due_date) return null;

    const firstDueDate = new Date(
      installmentPlan.first_installment_due_date.split("-").reverse().join("-")
    );
    const monthsToAdd = (nextInstallmentNumber - 1) * 3; // 3 months per installment

    const dueDate = new Date(firstDueDate);
    dueDate.setMonth(dueDate.getMonth() + monthsToAdd);

    return dueDate;
  };

  const dueDate = calculateDueDate() || nextDueDate;
  const today = new Date();
  const daysDelayed = dueDate
    ? Math.max(
        0,
        Math.floor(
          (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  // Calculate amounts
  const installmentAmount = parseFloat(
    installmentPlan?.ideal_kisht_mool || "0"
  );
  const interestAmount = parseFloat(installmentPlan?.ideal_kisht_byaj || "0");
  const lateFeePerDay = parseFloat(installmentPlan?.late_fee_per_day || "0");
  const lateFeeAmount = daysDelayed * lateFeePerDay;
  const totalAmount = installmentAmount + interestAmount + lateFeeAmount;

  const handlePayment = async () => {
    if (!propertyRecord || !installmentPlan || !dueDate) return;

    setLoading(true);
    setError(null);

    try {
      // Generate unique orderId
      const orderId = `INS-${Date.now()}`;

      // User ID (assuming 1 for now; replace with actual user ID from context/auth)
      const userId = 1;

      // Prepare installment data
      const installmentData = {
        property_id: propertyRecord.property_unique_id,
        property_record_id: propertyRecord.record_id,
        user_id: propertyRecord.user_id,
        payment_number: nextInstallmentNumber,
        payment_amount: (installmentAmount + interestAmount).toFixed(2),
        kisht_mool_paid: installmentAmount.toFixed(2),
        kisht_byaj_paid: interestAmount.toFixed(2),
        payment_due_date: dueDate.toISOString().split("T")[0],
        payment_date: today.toISOString().split("T")[0],
        number_of_days_delayed: daysDelayed,
        late_fee_amount: lateFeeAmount.toFixed(2),
        total_payment_amount_with_late_fee: totalAmount.toFixed(2),
      };

      // Prepare transaction data
      const transactionData = {
        payment_type: "installments",
        orderId: orderId,
        amount: totalAmount.toFixed(2),
        property_id: propertyRecord.property_unique_id,
        user_id: userId,
        processed_by: userId, // Same as user_id per requirement
        payment_method_type: "upi",
        transaction_error_type: null,
        auth_status: null,
      };

      const payload = {
        installments: [installmentData],
        transactions: [transactionData],
      }

      // Send request to /api/payments
      const response = await fetch(`${newBaseEndpoint}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bida_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment initiation failed");
      }

      handleRedirect(orderId, totalAmount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (orderId, amount) => {
    // Define the payment gateway URL and data
    const url = "https://emd.bidabhadohi.com/propertyMartPayment/payment";
    const data = {
      order_id: orderId,
      // amount: amount,
      amount: 2,
      customer_name: propertyRecord?.avanti_ka_naam || "Unknown",
      customer_email: "customer@example.com", // Replace with actual email if available
      customer_mobile: "8800218342", // Replace with actual mobile if available
      customer_address: "Unknown", // Replace with actual address if available
      property_id: propertyRecord?.property_unique_id || "Unknown",
    };

    // Create a form element
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    // Append data as hidden input fields
    Object.keys(data).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    });

    // Append the form to the body and submit it
    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    const token = localStorage.getItem("bida_token");
    if (!token || !location.state) {
      console.log(token, location.state);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => navigate("/alottee")}
            className="p-2 mr-4 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">EMI Payment</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {propertyRecord?.avanti_sampatti_sankhya || "N/A"}
                  </h2>
                  <p className="text-gray-500">
                    Property ID: {propertyRecord?.property_unique_id || "N/A"}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {propertyRecord?.yojna_name || "N/A"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <Calendar className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-800">
                    किस्त संख्या / EMI Number:{" "}
                    <span className="font-semibold">{nextInstallmentNumber}</span>
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    देय तिथि / Due Date:{" "}
                    <span className="font-semibold text-red-600">
                      {dueDate?.toLocaleDateString("en-IN") || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">Payment History</h3>
                <div className="h-40 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                  {/* This is a placeholder for payment history that could be added later */}
                  <p className="text-gray-500 text-sm text-center mt-12">
                    Previous payment records will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-gray-500 text-sm">किस्त जमा धनराशि / EMI Amount</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      ₹
                      {installmentAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xs">EMI</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-gray-500 text-sm">किस्त ब्याज धनराशि / Interest</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      ₹
                      {interestAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <span className="text-green-600 font-medium text-xs">INT</span>
                  </div>
                </div>
              </div>

              {daysDelayed > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center p-5 bg-red-50 rounded-lg border border-red-100">
                    <div>
                      <p className="text-red-600 text-sm">विलंब ब्याज धनराशि / Late Fee</p>
                      <p className="text-xl font-semibold text-red-700 mt-1">
                        ₹
                        {lateFeeAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        ₹{lateFeePerDay.toLocaleString("en-IN", { minimumFractionDigits: 2 })} × {daysDelayed} days
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-medium text-xs">LATE</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Important Notice</p>
                  <p className="text-sm text-blue-700 mt-1">
                    A late fee of ₹
                    {lateFeePerDay.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    per day will be charged after the due date. Please ensure timely payment to avoid additional charges.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-md mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-100">कुल धनराशि / Total Amount</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      ₹
                      {totalAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                    <p className="text-white text-sm font-medium">
                      Due: {dueDate?.toLocaleDateString("en-IN") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Payment Error</p>
                  </div>
                  <p className="mt-1 text-sm pl-7">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/alottee")}
                  className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`flex-1 py-4 px-6 bg-blue-600 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg
                    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BIDA Payment System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default EMIPayment;