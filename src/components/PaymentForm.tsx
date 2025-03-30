// src/components/PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    order_id: "",
    amount: "2.00", // Default amount as per the image
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    customer_address: "",
    property_id: "",
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to initiate payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate the payment initiation with BillDesk
    const paymentPayload = {
      merchantLogo: "",
      flowConfig: {
        merchantId: "BIDAPMS2V2",
        authToken:
          "OToken 0b79f81f18c9bb973f3e62a9776a3d09988ac1fceb4f53ca782691ffc7b7173aa25a387c7b4885dc9bcd2904bc411b14949f64b98fc74e0873205c47b6be1b23a809bc6a4dfdba76a50251be98b64b22d2268beecf81fc887dcd7860c5795c67901625c758e03c4f78d014e6cb28e6ef1737cffd3a1a3cc93b6cb2375cbbe1d35af7f0228f4ce004f1c88dcfbbc4c282c48ca20a9512a089685ba284e1ef1c115708d696ba7784.70675f706172616d5f656e6333;aHR0cHM6Ly9hcGkuYmlsbGRlc2suY29t",
        childWindow: "",
        retryCount: 0,
        returnUrl: "https://emd.bidabhadohi.com/propertyMartPayment/paymentStatus",
        showConvenienceFeeDetails: "",
        bdOrderId: "OA7YK6571FKP83T",
        mandateTokenId: "",
      },
      flowType: "payments",
      showSingleColumnSdk: "",
      target: {},
    };

    try {
      // Simulate the POST request to the payment gateway
      const response = await fetch(
        "https://emd.bidabhadohi.com/propertyMartPayment/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, ...paymentPayload }),
        }
      );

      if (response.ok) {
        // Redirect to the payment gateway (simulated here)
        window.location.href =
          "https://emd.bidabhadohi.com/propertyMartPayment/payment";
      } else {
        console.error("Payment initiation failed");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  // Check for payment status on redirect
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentResponse = query.get("paymentResponse");

    if (paymentResponse) {
      const responseData = JSON.parse(decodeURIComponent(paymentResponse));
      setPaymentStatus(responseData);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {paymentStatus ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Payment {paymentStatus.success ? "Successful" : "Failed"}
            </h2>
            {paymentStatus.success && (
              <div className="text-left">
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {paymentStatus.ResponseData.transactionid}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{paymentStatus.ResponseData.amount}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {paymentStatus.ResponseData.transaction_date}
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {paymentStatus.ResponseData.payment_method_type.toUpperCase()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {paymentStatus.ResponseData.transaction_error_desc}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Payment Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order ID
                </label>
                <input
                  type="text"
                  name="order_id"
                  value={formData.order_id}
                  onChange={handleChange}
                  placeholder="Order ID"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Customer Name"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Email
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="Customer Email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Mobile
                </label>
                <input
                  type="tel"
                  name="customer_mobile"
                  value={formData.customer_mobile}
                  onChange={handleChange}
                  placeholder="Customer Mobile"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Address
                </label>
                <input
                  type="text"
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  placeholder="Customer Address"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property ID
                </label>
                <input
                  type="text"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleChange}
                  placeholder="Property ID"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Proceed to Payment
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;