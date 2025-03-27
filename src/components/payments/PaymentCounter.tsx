import React, { useState, useEffect } from 'react';
import { X, Search, IndianRupee, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import BASE_URL from '../../data/endpoint';

interface PaymentCounterProps {
  onClose: () => void;
}

type PaymentType = 'installment' | 'service_charge';

export function PaymentCounter({ onClose }: PaymentCounterProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>('installment');
  const [selectedYojna, setSelectedYojna] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'phone' | 'property_id'>('name');
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Fetch yojnas on mount
  useEffect(() => {
    const fetchYojnas = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/yojnas`);
        const data = await response.json();
        setYojnas(data.data);
      } catch (error) {
        console.error('Error fetching yojnas:', error);
      }
    };
    fetchYojnas();
  }, []);

  // Search properties based on criteria
  const handleSearch = async () => {
    if (!searchQuery || !selectedYojna) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        yojna_id: selectedYojna,
        [searchType]: searchQuery
      });

      const response = await fetch(`${BASE_URL}/api/properties?${params}`);
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    // Here you would implement the actual payment submission
    // For now, we'll just show the success animation
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
      // Here you would trigger the PDF receipt download
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payment Counter
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 dark:text-white">
          {/* Payment Type Selection */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 dark:text-white mb-3">
              Payment Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentType('installment')}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200 text-base min-w-[180px]',
                  paymentType === 'installment'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                )}
              >
                Installment Payment
              </button>
              <button
                onClick={() => setPaymentType('service_charge')}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200 text-base min-w-[180px]',
                  paymentType === 'service_charge'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                )}
              >
                Service Charge
              </button>
            </div>
          </div>

          {/* Yojna Selection */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 dark:text-white mb-3">
              Select Yojna
            </label>
            <select
              value={selectedYojna}
              onChange={(e) => setSelectedYojna(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a yojna...</option>
              {yojnas.map((yojna) => (
                <option key={yojna.yojna_id} value={yojna.yojna_id}>
                  {yojna.yojna_name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Section */}
          <div className="mb-6 overflow-visible">
            <div className="flex gap-4 mb-4">
              <div className="w-48">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="name">Search by Name</option>
                  <option value="phone">Search by Phone</option>
                  <option value="property_id">Search by Property ID</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Enter ${searchType.replace('_', ' ')}...`}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery || !selectedYojna}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                Search
              </button>
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Searching properties...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="border dark:border-gray-700 rounded-lg overflow-x-auto bg-white dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Property ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Owner Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 relative">
                    {searchResults.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {property.property_unique_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {property.avanti_ka_naam}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {property.mobile_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : searchResults.length === 0 && searchQuery ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : null}
          </div>

          {/* Selected Property Details */}
          {selectedProperty && (
            <div className="border dark:border-gray-700 rounded-lg p-6 mb-6 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selected Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property ID</p>
                  <p className="font-medium text-gray-600 dark:text-white">{selectedProperty.property_unique_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner Name</p>
                  <p className="font-medium">{selectedProperty.avanti_ka_naam}</p>
                </div>
                {paymentType === 'installment' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Next Due Date</p>
                      <p className="font-medium">{selectedProperty.next_due_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Installment Amount</p>
                      <p className="font-medium">₹{selectedProperty.installment_amount}</p>
                    </div>
                  </>
                )}
                {paymentType === 'service_charge' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Service Charge Amount</p>
                      <p className="font-medium">₹{selectedProperty.service_charge_amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Financial Year</p>
                      <p className="font-medium">{selectedProperty.financial_year}</p>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleSubmitPayment}
                className="mt-6 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg"
              >
                <IndianRupee className="h-5 w-5" />
                Process Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-full p-8 shadow-2xl">
            <div className="animate-success-check">
              <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}