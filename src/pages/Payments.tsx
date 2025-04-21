import BASE_URL from "../data/endpoint";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft, Download } from "lucide-react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import bidaLogo from "../assets/BIDA-logo.jpg";
import upLogo from "../assets/upLogo.png";

import bidaLogoBase64 from "../assets/BIDA-logo.jpg";
import upLogoBase64 from "../assets/upLogo.png";

function generateReceiptPdf(transactionData) {
  const { transaction, payments } = transactionData;
  const isServiceCharge = transaction.payment_type === "serviceCharges";
  const totalAmount = parseFloat(transaction.amount).toFixed(2);
  const formattedDate = transaction.created_at
    ? new Date(transaction.created_at).toLocaleString()
    : "N/A";
  const printDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  // Service Charge Details Component
  const renderServiceChargeDetails = (payment) => `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 0.5rem 0;">
      <span style="font-weight: 500; color: #4b5563;">Financial Year:</span>
      <span style="font-weight: 600;">${
        payment.service_charge_financial_year
      }</span>
      
      <span style="font-weight: 500; color: #4b5563;">Service Charge Amount:</span>
      <span style="font-weight: 600;">₹${parseFloat(
        payment.service_charge_amount
      ).toFixed(2)}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Late Fee:</span>
      <span style="font-weight: 600;">₹${parseFloat(
        payment.service_charge_late_fee
      ).toFixed(2)}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Total:</span>
      <span style="font-weight: 600; color: #16a34a;">
        ₹${(
          parseFloat(payment.service_charge_amount) +
          parseFloat(payment.service_charge_late_fee)
        ).toFixed(2)}
      </span>
      
      <hr style="grid-column: span 2; border-color: #d1d5db; margin: 0.5rem 0;" />
    </div>
  `;

  // Installment Details Component
  const renderInstallmentDetails = (payment) => `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 0.5rem 0;">
      <span style="font-weight: 500; color: #4b5563;">Installment Number:</span>
      <span style="font-weight: 600;">${payment.payment_number}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Principal Amount:</span>
      <span style="font-weight: 600;">₹${parseFloat(
        payment.kisht_mool_paid
      ).toFixed(2)}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Interest Amount:</span>
      <span style="font-weight: 600;">₹${parseFloat(
        payment.kisht_byaj_paid
      ).toFixed(2)}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Base Payment Amount:</span>
      <span style="font-weight: 600;">₹${parseFloat(
        payment.payment_amount
      ).toFixed(2)}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Days Delayed:</span>
      <span style="font-weight: 600;">${payment.number_of_days_delayed}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Late Fee:</span>
      <span style="font-weight: 600;">₹${parseFloat(
        payment.late_fee_amount
      ).toFixed(2)}</span>
      
      <span style="font-weight: 500; color: #4b5563;">Total Amount:</span>
      <span style="font-weight: 600; color: #16a34a;">
        ₹${parseFloat(payment.total_payment_amount_with_late_fee).toFixed(2)}
      </span>
      
      <hr style="grid-column: span 2; border-color: #d1d5db; margin: 0.5rem 0;" />
    </div>
  `;

  // Generate HTML content
  const htmlContent = `
    <div style="width: 595px; min-height: 842px; background-color: #ffffff; padding: 20px; font-family: Arial, sans-serif; position: relative; box-sizing: border-box;">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; opacity: 0.1; pointer-events: none;">
        <div style="transform: rotate(-45deg); font-size: 80px; color: #dc2626; font-weight: bold; opacity: 0.3;">B.I.D.A</div>
      </div>

      <div style="width: 100%;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="flex-shrink: 0;">
            <img src="${bidaLogoBase64}" alt="BIDA Logo" style="height: 56px; width: auto;" />
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; flex-grow: 1; padding: 0 16px;">
            <h1 style="color: #dc2626; font-weight: 700; text-align: center; font-size: 16px;">
              Bhadohi Industrial Development Authority
            </h1>
            <h2 style="font-size: 14px; font-weight: 500; text-align: center;">
              भदोही औद्योगिक विकास प्राधिकरण
            </h2>
          </div>
          <div style="flex-shrink: 0;">
            <img src="${upLogoBase64}" alt="UP Government Logo" style="height: 48px; width: auto;" />
          </div>
        </div>
        <hr style="border-color: #d1d5db; margin: 8px 0;" />
        <h3 style="text-align: center; font-weight: 700; font-size: 18px; color: #1f2937; margin: 8px 0;">
          Payment Receipt - ${
            isServiceCharge ? "Service Charge" : "Installment"
          }
        </h3>
      </div>

      <div style="width: 100%; margin-top: 24px; padding: 0 16px;">
        <div style="margin-bottom: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Property Number:</span>
            <span style="font-weight: 600;">${transaction.property_id}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Scheme:</span>
            <span style="font-weight: 600;">${transaction.yojna_name}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Allottee Name:</span>
            <span style="font-weight: 600;">${transaction.user_name}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Property Type:</span>
            <span style="font-weight: 600;">${transaction.sampatti_sreni}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Property Number:</span>
            <span style="font-weight: 600;">${
              transaction.avanti_sampatti_sankhya
            }</span>
          </div>

          <hr style="border-color: #1f2937; margin: 16px 0;" />

          <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 8px;">Payment Details</h4>
          
          ${
            isServiceCharge
              ? payments
                  .map((payment) => renderServiceChargeDetails(payment))
                  .join("")
              : payments
                  .map((payment) => renderInstallmentDetails(payment))
                  .join("")
          }

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Total Amount Paid:</span>
            <span style="font-weight: 600; color: #16a34a;">₹${totalAmount}</span>
          </div>

          <hr style="border-color: #1f2937; margin: 16px 0;" />

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Payment Status:</span>
            <span style="font-weight: 600; color: ${
              transaction.status === "paid" ||
              transaction.transaction_error_type === "success"
                ? "#16a34a"
                : "#ca8a04"
            };">
              ${
                transaction.status === "paid" ||
                transaction.transaction_error_type === "success"
                  ? "Paid"
                  : transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)
              }
            </span>
          </div>

          ${
            transaction.transactionid
              ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <span style="font-weight: 500; color: #4b5563;">Transaction ID:</span>
                  <span style="font-weight: 600;">${transaction.transactionid}</span>
                </div>
              `
              : ""
          }

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Order ID:</span>
            <span style="font-weight: 600;">${transaction.orderId}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <span style="font-weight: 500; color: #4b5563;">Payment Date & Time:</span>
            <span style="font-weight: 600;">${formattedDate}</span>
          </div>

          ${
            transaction.payment_method_type
              ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <span style="font-weight: 500; color: #4b5563;">Payment Method:</span>
                  <span style="font-weight: 600; text-transform: capitalize;">${transaction.payment_method_type}</span>
                </div>
              `
              : ""
          }
        </div>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; position: absolute; bottom: 20px; width: calc(100% - 40px);">
        <div style="font-size: 10px; color: #6b7280; text-align: center;">
          This is an electronically generated receipt.<br />
          No physical signature is required.
        </div>
      </div>
    </div>
  `;

  // Create a temporary container for rendering
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.innerHTML = htmlContent;
  document.body.appendChild(tempContainer);

  // Generate PDF
  const generatePdf = async () => {
    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add watermark
      pdf.setFontSize(72);
      pdf.setTextColor(220, 38, 38, 0.3); // #dc2626 with opacity
      pdf.text("BIDA", pdfWidth / 2, pdfHeight / 2, {
        angle: -45,
        align: "center",
      });

      // Add header
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55); // #1f2937
      pdf.text("Payment Receipt", pdfWidth / 2, 20, { align: "center" });

      // Add print date
      pdf.setFontSize(8);
      pdf.text(`Printed on: ${printDate}`, pdfWidth - 15, 10, {
        align: "right",
      });

      // Calculate image dimensions
      const canvasAspectRatio = canvas.width / canvas.height;
      const maxWidth = pdfWidth - 20;
      const maxHeight = pdfHeight - 60;
      let finalWidth = maxWidth;
      let finalHeight = maxWidth / canvasAspectRatio;

      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = maxHeight * canvasAspectRatio;
      }

      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = 30;

      // Add content image
      pdf.addImage(imgData, "PNG", imgX, imgY, finalWidth, finalHeight);

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128); // #6b7280
      pdf.text(
        "This is a computer-generated receipt. No signature required.",
        pdfWidth / 2,
        pdfHeight - 10,
        { align: "center" }
      );

      // Set PDF properties
      pdf.setProperties({
        title: "Payment Receipt",
        creator: "BIDA",
        subject: "Payment Receipt",
      });

      // Save PDF
      pdf.save("payment-receipt.pdf");

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      document.body.removeChild(tempContainer);
    }
  };

  generatePdf();
}

const DownloadButton = ({ receiptRef, transactionData }) => {
  return (
    <button
      // onClick={downloadPDF}
      onClick={() => {
        // console.log(generateReceiptPdf(transactionData))
        generateReceiptPdf(transactionData);
      }}
      style={{
        width: "100%",
        marginTop: "1.5rem",
        backgroundColor: "#dc2626",
        color: "#ffffff",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.3s",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
    >
      <Download
        style={{ width: "20px", height: "20px", marginRight: "0.5rem" }}
      />
      Download Receipt
    </button>
  );
};

const ServiceChargeDetails = ({ payment }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.5rem",
        margin: "0.5rem 0",
      }}
    >
      <span style={{ fontWeight: 500, color: "#4b5563" }}>Financial Year:</span>
      <span style={{ fontWeight: 600 }}>
        {payment.service_charge_financial_year}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>
        Service Charge Amount:
      </span>
      <span style={{ fontWeight: 600 }}>
        ₹{parseFloat(payment.service_charge_amount).toFixed(2)}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>Late Fee:</span>
      <span style={{ fontWeight: 600 }}>
        ₹{parseFloat(payment.service_charge_late_fee).toFixed(2)}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>Total:</span>
      <span style={{ fontWeight: 600, color: "#16a34a" }}>
        ₹
        {(
          parseFloat(payment.service_charge_amount) +
          parseFloat(payment.service_charge_late_fee)
        ).toFixed(2)}
      </span>

      <hr
        style={{
          gridColumn: "span 2",
          borderColor: "#d1d5db",
          margin: "0.5rem 0",
        }}
      />
    </div>
  );
};

const InstallmentDetails = ({ payment }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.5rem",
        margin: "0.5rem 0",
      }}
    >
      <span style={{ fontWeight: 500, color: "#4b5563" }}>
        Installment Number:
      </span>
      <span style={{ fontWeight: 600 }}>{payment.payment_number}</span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>
        Principal Amount:
      </span>
      <span style={{ fontWeight: 600 }}>
        ₹{parseFloat(payment.kisht_mool_paid).toFixed(2)}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>
        Interest Amount:
      </span>
      <span style={{ fontWeight: 600 }}>
        ₹{parseFloat(payment.kisht_byaj_paid).toFixed(2)}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>
        Base Payment Amount:
      </span>
      <span style={{ fontWeight: 600 }}>
        ₹{parseFloat(payment.payment_amount).toFixed(2)}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>Days Delayed:</span>
      <span style={{ fontWeight: 600 }}>{payment.number_of_days_delayed}</span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>Late Fee:</span>
      <span style={{ fontWeight: 600 }}>
        ₹{parseFloat(payment.late_fee_amount).toFixed(2)}
      </span>

      <span style={{ fontWeight: 500, color: "#4b5563" }}>Total Amount:</span>
      <span style={{ fontWeight: 600, color: "#16a34a" }}>
        ₹{parseFloat(payment.total_payment_amount_with_late_fee).toFixed(2)}
      </span>

      <hr
        style={{
          gridColumn: "span 2",
          borderColor: "#d1d5db",
          margin: "0.5rem 0",
        }}
      />
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
        const response = await fetch(
          `${BASE_URL}/api/payments/transactions/${order_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transaction data");
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              height: "3rem",
              width: "3rem",
              borderBottom: "2px solid #111827",
              margin: "0 auto",
            }}
          ></div>
          <p style={{ marginTop: "1rem", color: "#374151" }}>
            Loading receipt...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            maxWidth: "28rem",
            width: "100%",
          }}
        >
          <h2
            style={{
              color: "#dc2626",
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Error
          </h2>
          <p style={{ color: "#374151" }}>{error}</p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#1d4ed8")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
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
  const formattedDate = transaction.created_at
    ? new Date(transaction.created_at).toLocaleString()
    : "N/A";
  const isServiceCharge = transaction.payment_type === "serviceCharges";
  const totalAmount = parseFloat(transaction.amount).toFixed(2);

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ maxWidth: "28rem", margin: "0 auto" }}>
          <div
            ref={receiptRef}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              padding: "1.5rem",
              animation: "fadeIn 0.5s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.05,
                pointerEvents: "none",
                transform: "rotate(-30deg) scale(1.8)",
              }}
            >
              <img
                src={bidaLogo}
                alt=""
                style={{ width: "80%", height: "auto", margin: "0 auto" }}
                crossOrigin="anonymous"
              />
            </div>

            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={bidaLogo}
                    alt="BIDA Logo"
                    style={{ height: "3.5rem", width: "auto" }}
                    crossOrigin="anonymous"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexGrow: 1,
                    padding: "0 1rem",
                  }}
                >
                  <h1
                    style={{
                      color: "#dc2626",
                      fontWeight: 700,
                      textAlign: "center",
                      fontSize: "1rem",
                    }}
                  >
                    Bhadohi Industrial Development Authority
                  </h1>
                  <h2
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    भदोही औद्योगिक विकास प्राधिकरण
                  </h2>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={upLogo}
                    alt="UP Government Logo"
                    style={{ height: "3rem", width: "auto" }}
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <hr style={{ borderColor: "#d1d5db", margin: "0.5rem 0" }} />
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#1f2937",
                  margin: "0.5rem 0",
                }}
              >
                Payment Receipt -{" "}
                {isServiceCharge ? "Service Charge" : "Installment"}
              </h3>
            </div>

            <div
              style={{ width: "100%", marginTop: "1.5rem", padding: "0 1rem" }}
            >
              <div style={{ marginBottom: "0.75rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Property Number:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {transaction.property_id}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Scheme:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {transaction.yojna_name}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Allottee Name:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {transaction.user_name}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Property Type:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {transaction.sampatti_sreni}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Property Number:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {transaction.avanti_sampatti_sankhya}
                  </span>
                </div>

                <hr style={{ borderColor: "#1f2937", margin: "1rem 0" }} />

                <h4
                  style={{
                    fontWeight: 700,
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Payment Details
                </h4>

                {isServiceCharge
                  ? payments.map((payment, index) => (
                      <ServiceChargeDetails
                        key={payment.service_charge_id}
                        payment={payment}
                      />
                    ))
                  : payments.map((payment, index) => (
                      <InstallmentDetails
                        key={payment.payment_id}
                        payment={payment}
                      />
                    ))}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Total Amount Paid:
                  </span>
                  <span style={{ fontWeight: 600, color: "#16a34a" }}>
                    ₹{totalAmount}
                  </span>
                </div>

                <hr style={{ borderColor: "#1f2937", margin: "1rem 0" }} />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Payment Status:
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        transaction.status === "paid" ||
                        transaction.transaction_error_type === "success"
                          ? "#16a34a"
                          : "#ca8a04",
                    }}
                  >
                    {transaction.status === "paid" ||
                    transaction.transaction_error_type === "success"
                      ? "Paid"
                      : transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                  </span>
                </div>

                {transaction.transactionid && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "#4b5563" }}>
                      Transaction ID:
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {transaction.transactionid}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Order ID:
                  </span>
                  <span style={{ fontWeight: 600 }}>{transaction.orderId}</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#4b5563" }}>
                    Payment Date & Time:
                  </span>
                  <span style={{ fontWeight: 600 }}>{formattedDate}</span>
                </div>

                {transaction.payment_method_type && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "#4b5563" }}>
                      Payment Method:
                    </span>
                    <span
                      style={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
                      {transaction.payment_method_type}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                This is an electronically generated receipt.
                <br />
                No physical signature is required.
              </div>
            </div>
          </div>

          <DownloadButton
            transactionData={transactionData}
          />

          <button
            onClick={() => {
              window.location.href =
                "https://propertyapp.bidabhadohi.com/property/home";
            }}
            style={{
              width: "100%",
              marginTop: "1.5rem",
              backgroundColor: "#6f1cff",
              color: "#ffffff",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#844dff")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#6f1cff")
            }
          >
            <ArrowLeft
              style={{ width: "20px", height: "20px", marginRight: "0.5rem" }}
            />
            Go Back
          </button>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "#6b7280",
            }}
          >
            © {new Date().getFullYear()} Bhadohi Industrial Development
            Authority
          </div>
        </div>
      </div>
    </div>
  );
};

export { Payments };
