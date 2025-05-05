import React, { useState, useEffect } from "react";
import TransactionCard from "./TransactionCard";
import Pagination from "./Pagination";
import { fetchTransactions } from "../../services/api";
import { Loader2 } from "lucide-react";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions(pagination.currentPage);
  }, []);

  const loadTransactions = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetchTransactions(page, pagination.pageSize);
      setTransactions(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.currentPage) {
      loadTransactions(newPage);
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn ">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Transactions
        </h2>
        {/* <span className="text-sm text-gray-500">
          Showing {transactions.length} of {pagination.totalRecords} transactions
        </span> */}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {transactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          No transactions found.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
