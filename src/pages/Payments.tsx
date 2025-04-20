import BASE_URL from "../data/endpoint";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Download } from 'lucide-react';

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import bidaLogo from "../assets/BIDA-logo.jpg";
import upLogo from "../assets/upLogo.png";

const DownloadButton = ({ receiptRef }) => {
  const downloadPDF = () => {
    if (!receiptRef.current) return;
    console.log(receiptRef);

    html2canvas(receiptRef.current, {
      scale: 1,
      backgroundColor: "#ffffff",
      allowTaint: true,
      foreignObjectRendering: true,
      logging: true,
      // width: receiptRef.current.offsetWidth,
      // height: receiptRef.current.offsetHeight,
      onclone: (clonedDoc) => {
        const images = clonedDoc.getElementsByTagName("img");
        for (let img of images) {
          img.style.maxWidth = "none";
          img.crossOrigin = "anonymous";
        }
      },
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to maintain aspect ratio
      const canvasAspectRatio = canvas.width / canvas.height;
      const maxWidth = pdfWidth - 20; // 10mm margin on each side
      const maxHeight = pdfHeight - 60; // 30mm margin top and bottom

      let finalWidth = maxWidth;
      let finalHeight = maxWidth / canvasAspectRatio;

      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = maxHeight * canvasAspectRatio;
      }

      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = 40; // Increased top margin for better positioning

      // Set PDF properties
      pdf.setProperties({
        title: "Payment Receipt",
        creator: "BIDA",
        subject: "Payment Receipt",
      });

      // Add title
      pdf.setFontSize(16);
      pdf.text("Payment Receipt", pdfWidth / 2, 20, { align: "center" });

      // Add print time
      const printDate = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      });
      pdf.setFontSize(8);
      pdf.text(`Printed on: ${printDate}`, pdfWidth - 15, 10, {
        align: "right",
      });

      // Add the receipt image
      pdf.addImage(imgData, "PNG", imgX, imgY, finalWidth, finalHeight);

      // Add footer
      pdf.setFontSize(8);
      pdf.text(
        "This is a computer-generated receipt. No signature required.",
        pdfWidth / 2,
        pdfHeight - 10,
        { align: "center" }
      );

      pdf.save("payment-receipt.pdf");
    });
  };

  return (
    <button
      onClick={downloadPDF}
      className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-md"
    >
      <Download size={20} className="mr-2" />
      Download Receipt
    </button>
  );
};

const ServiceChargeDetails = ({ payment }) => {
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <span className="font-medium text-gray-600">Financial Year:</span>
      <span className="font-semibold">{payment.service_charge_financial_year}</span>
      
      <span className="font-medium text-gray-600">Service Charge Amount:</span>
      <span className="font-semibold">₹{parseFloat(payment.service_charge_amount).toFixed(2)}</span>
      
      <span className="font-medium text-gray-600">Late Fee:</span>
      <span className="font-semibold">₹{parseFloat(payment.service_charge_late_fee).toFixed(2)}</span>
      
      <span className="font-medium text-gray-600">Total:</span>
      <span className="font-semibold text-green-600">
        ₹{(parseFloat(payment.service_charge_amount) + parseFloat(payment.service_charge_late_fee)).toFixed(2)}
      </span>
      
      <hr className="col-span-2 border-gray-300 my-2" />
    </div>
  );
};

const InstallmentDetails = ({ payment }) => {
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <span className="font-medium text-gray-600">Installment Number:</span>
      <span className="font-semibold">{payment.payment_number}</span>
      
      <span className="font-medium text-gray-600">Principal Amount:</span>
      <span className="font-semibold">₹{parseFloat(payment.kisht_mool_paid).toFixed(2)}</span>
      
      <span className="font-medium text-gray-600">Interest Amount:</span>
      <span className="font-semibold">₹{parseFloat(payment.kisht_byaj_paid).toFixed(2)}</span>
      
      <span className="font-medium text-gray-600">Base Payment Amount:</span>
      <span className="font-semibold">₹{parseFloat(payment.payment_amount).toFixed(2)}</span>
      
      <span className="font-medium text-gray-600">Days Delayed:</span>
      <span className="font-semibold">{payment.number_of_days_delayed}</span>
      
      <span className="font-medium text-gray-600">Late Fee:</span>
      <span className="font-semibold">₹{parseFloat(payment.late_fee_amount).toFixed(2)}</span>
      
      <span className="font-medium text-gray-600">Total Amount:</span>
      <span className="font-semibold text-green-600">₹{parseFloat(payment.total_payment_amount_with_late_fee).toFixed(2)}</span>
      
      <hr className="col-span-2 border-gray-300 my-2" />
    </div>
  );
};

const Payments = () => {
  const { order_id } = useParams();
  const receiptRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/payments/transactions/${order_id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        
        const data = await response.json();
        setTransactionData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (order_id) {
      fetchTransactionData();
    }
  }, [order_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!transactionData) {
    return null;
  }

  const { transaction, payments } = transactionData;
  const formattedDate = transaction.created_at ? new Date(transaction.created_at).toLocaleString() : 'N/A';
  const isServiceCharge = transaction.payment_type === "serviceCharges";
  const totalAmount = parseFloat(transaction.amount).toFixed(2);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div
            ref={receiptRef}
            className="bg-white rounded-lg shadow-md p-6 animate-fadeIn relative overflow-hidden"
          >
            <div
              className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none"
              style={{ transform: "rotate(-30deg) scale(1.8)" }}
            >
              <img
                src={bidaLogo}
                alt=""
                className="w-4/5 h-auto mx-auto"
                crossOrigin="anonymous"
              />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={bidaLogo}
                    alt="BIDA Logo"
                    className="h-14 w-auto"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex flex-col items-center flex-grow px-4">
                  <h1 className="text-red-600 font-bold text-center text-base md:text-lg">
                    Bhadohi Industrial Development Authority
                  </h1>
                  <h2 className="text-sm font-medium text-center">
                    भदोही औद्योगिक विकास प्राधिकरण
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={upLogo}
                    alt="UP Government Logo"
                    className="h-12 w-auto"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <hr className="border-gray-300 my-2" />
              <h3 className="text-center font-bold text-lg text-gray-800 my-2">
                Payment Receipt - {isServiceCharge ? "Service Charge" : "Installment"}
              </h3>
            </div>

            <div className="w-full mt-6 px-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Property Number:</span>
                  <span className="font-semibold">{transaction.property_id}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Scheme:</span>
                  <span className="font-semibold">{transaction.yojna_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Allottee Name:</span>
                  <span className="font-semibold">{transaction.user_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Property Type:</span>
                  <span className="font-semibold">{transaction.sampatti_sreni}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Property Number:</span>
                  <span className="font-semibold">{transaction.avanti_sampatti_sankhya}</span>
                </div>

                <hr className="border-gray-800 my-4" />

                {/* Payment Details Section */}
                <h4 className="font-bold text-gray-800 mb-2">Payment Details</h4>
                
                {isServiceCharge ? (
                  payments.map((payment, index) => (
                    <ServiceChargeDetails key={payment.service_charge_id} payment={payment} />
                  ))
                ) : (
                  payments.map((payment, index) => (
                    <InstallmentDetails key={payment.payment_id} payment={payment} />
                  ))
                )}

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Total Amount Paid:</span>
                  <span className="font-semibold text-green-600">₹{totalAmount}</span>
                </div>

                <hr className="border-gray-800 my-4" />

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Payment Status:</span>
                  <span className={`font-semibold ${transaction.status === 'paid' || transaction.transaction_error_type === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {transaction.status === 'paid' || transaction.transaction_error_type === 'success' ? 'Paid' : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>

                {transaction.transactionid && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600">Transaction ID:</span>
                    <span className="font-semibold">{transaction.transactionid}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Order ID:</span>
                  <span className="font-semibold">{transaction.orderId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">
                    Payment Date & Time:
                  </span>
                  <span className="font-semibold">{formattedDate}</span>
                </div>

                {transaction.payment_method_type && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600">Payment Method:</span>
                    <span className="font-semibold capitalize">{transaction.payment_method_type}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                This is an electronically generated receipt.
                <br />
                No physical signature is required.
              </div>
            </div>
          </div>

          <DownloadButton receiptRef={receiptRef} />

          <div className="mt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Bhadohi Industrial Development Authority
          </div>
        </div>
      </div>
    </div>
  );
};

export  {Payments};