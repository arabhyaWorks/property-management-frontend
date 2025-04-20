import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  IndianRupee,
  Clock,
  AlertTriangle,
  Wallet,
  FileCheck,
  Home,
  ArrowLeft,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useTranslation } from "../hooks/useTranslation";
import BASE_URL from "../data/endpoint";

interface Transaction {
  id: number;
  payment_type: "installments" | "serviceCharges";
  payment_idies: string;
  orderId: string;
  amount: string;
  property_id: string;
  user_id: number;
  processed_by: number;
  payment_method_type: string;
  transaction_error_type: string;
  auth_status: string | null;
  transactionid: string;
  status: string;
  response_data: string;
  created_at: string;
  updated_at: string;
}

interface InstallmentPayment {
  payment_id: string;
  property_id: string;
  property_record_id: number;
  user_id: number;
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
  response_payload: string | null;
  created_at: string;
  updated_at: string;
}

interface ServiceChargePayment {
  service_charge_id: string;
  property_id: string;
  property_record_id: number;
  user_id: number;
  status: string;
  service_charge_financial_year: string;
  service_charge_amount: string;
  service_charge_late_fee: string;
  service_charge_payment_date: string;
  response_payload: string | null;
  created_at: string;
  updated_at: string;
}

interface PaymentResponse {
  transaction: Transaction;
  payments: (InstallmentPayment | ServiceChargePayment)[];
}

const COLORS = ["#4CAF50", "#EF4444"]; // Green for paid, Red for pending

export function Payments() {
  const { t } = useTranslation();
  const { order_id } = useParams<{ order_id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/payments/transactions/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("bida_token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch payment data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [order_id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-600 dark:text-gray-300 animate-pulse">
            Loading...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center text-red-500 dark:text-red-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p>{error || "Payment data not found"}</p>
            <button
              onClick={() => navigate("/property/home")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { transaction, payments } = data;
  const isInstallment = transaction.payment_type === "installments";
  const totalAmount = parseFloat(transaction.amount);
  const paidAmount = payments.reduce(
    (sum, payment) =>
      sum +
      parseFloat(
        isInstallment
          ? (payment as InstallmentPayment).total_payment_amount_with_late_fee
          : (payment as ServiceChargePayment).service_charge_amount
      ),
    0
  );
  const remainingAmount = totalAmount - paidAmount;

  const pieData = [
    { name: "Paid", value: paidAmount },
    { name: "Remaining", value: remainingAmount > 0 ? remainingAmount : 0 },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/property/home")}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full mr-3"
        >
          {/* <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" /> */}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Detail - {transaction.orderId}
        </h1>
      </div>

      {/* Transaction Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transaction Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Property ID: {transaction.property_id}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              transaction.transaction_error_type === "success"
                ? "bg-green-100 text-green-800"
                : transaction.transaction_error_type === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {transaction.transaction_error_type || "Unknown"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{parseFloat(transaction.amount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {new Date(transaction.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transaction ID
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {transaction.transactionid}
              </p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        {/* <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Payment Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center space-x-6 mt-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Paid</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Remaining</span>
          </div>
        </div>
      </div> */}
      </div>

      {/* Payment Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {isInstallment ? "Installment Payments" : "Service Charge Payments"}
        </h2>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={
                isInstallment
                  ? (payment as InstallmentPayment).payment_id
                  : (payment as ServiceChargePayment).service_charge_id
              }
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isInstallment
                    ? `Installment #${
                        (payment as InstallmentPayment).payment_number
                      }`
                    : (payment as ServiceChargePayment)
                        .service_charge_financial_year}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isInstallment
                    ? `Due: ${(payment as InstallmentPayment).payment_due_date}`
                    : `Paid on: ${
                        (payment as ServiceChargePayment)
                          .service_charge_payment_date
                      }`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹
                  {parseFloat(
                    isInstallment
                      ? (payment as InstallmentPayment)
                          .total_payment_amount_with_late_fee
                      : (payment as ServiceChargePayment).service_charge_amount
                  ).toLocaleString("en-IN")}
                </p>
                {isInstallment &&
                  (payment as InstallmentPayment).late_fee_amount !==
                    "0.00" && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      Late Fee: ₹
                      {(payment as InstallmentPayment).late_fee_amount}
                    </p>
                  )}
                {isInstallment && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Paid on: {(payment as InstallmentPayment).payment_date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
