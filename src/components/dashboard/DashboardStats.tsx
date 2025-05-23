import React, { useEffect, useState } from 'react';
import { IndianRupee, Building2, Wallet, CreditCard, ParkingCircle, CornerUpRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import BASE_URL from '../../data/endpoint';

export default function DashboardStats() {
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format large numbers into Indian units (lakhs, crores)
  const formatIndianNumber = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) return '₹0';

    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`; // Crores
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`; // Lakhs
    } else {
      return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`; // Rupees
    }
  };

  // Fetch stats from the new API endpoint
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/financial`);
        if (!response.ok) {
          throw new Error('Failed to fetch financial stats');
        }
        const result = await response.json();
        setStatsData(result.data); // The API wraps the data in a "data" object
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Define the stats structure with the new API data
  const stats = statsData
    ? [
        {
          label: 'Total Registration Amount',
          value: formatIndianNumber(statsData.total_panjikaran_dhanrashi),
          icon: IndianRupee,
          color: 'bg-blue-500',
        },
        {
          label: 'Total Allocation Amount',
          value: formatIndianNumber(statsData.total_avantan_dhanrashi),
          icon: Wallet,
          color: 'bg-green-500',
        },
        {
          label: 'Total Sale Value',
          value: formatIndianNumber(statsData.total_vikray_mulya),
          icon: CreditCard,
          color: 'bg-yellow-500',
        },
        {
          label: 'Total Freehold Amount',
          value: formatIndianNumber(statsData.total_free_hold_dhanrashi),
          icon: Building2,
          color: 'bg-purple-500',
        },
        {
          label: 'Total Auction Value',
          value: formatIndianNumber(statsData.total_auction_keemat),
          icon: IndianRupee,
          color: 'bg-indigo-500',
        },
        {
          label: 'Total Lease Rent',
          value: formatIndianNumber(statsData.total_lease_rent_dhanrashi),
          icon: Wallet,
          color: 'bg-teal-500',
        },
        {
          label: 'Total Park Charge',
          value: formatIndianNumber(statsData.total_park_charge),
          icon: ParkingCircle,
          color: 'bg-orange-500',
        },
        {
          label: 'Total Corner Charge',
          value: formatIndianNumber(statsData.total_corner_charge),
          icon: CornerUpRight,
          color: 'bg-red-500',
        },
      ]
    : [];

  // Loading state
  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading stats...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {stat.label}
            </h3>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              {t('viewDetails')} →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}