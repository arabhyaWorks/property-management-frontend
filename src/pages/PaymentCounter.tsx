import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Search, IndianRupee, Loader2, Calendar, User, Phone, Tag, ArrowLeft, Download, Home } from 'lucide-react';

import BASE_URL from '../data/endpoint';
import { toast, Toaster } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

interface Property {
  property_unique_id: string;
  avanti_ka_naam: string;
  mobile_no: string;
  sampatti_sreni: string;
  avanti_sampatti_sankhya: string;
  yojna_id: string;
  yojna_name: string;
  next_due_date?: string;
  installment_amount?: number;
  service_charge_amount?: number;
  financial_year?: string;
  property_floor_type?: string;
}

export default function PaymentCounter() {
  const navigate = useNavigate();
  const [selectedYojna, setSelectedYojna] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'phone' | 'property_id' | 'sampatti_sreni'>('name');
  const [floorType, setFloorType] = useState<string>('');
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const receiptRef = React.useRef<HTMLDivElement>(null);

  // Fetch yojnas on mount
  useEffect(() => {
    const fetchYojnas = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/yojnas`);
        // if (!response.ok) throw new Error('Failed to fetch yojnas');
        const data = await response.json();
        console.log('Yojnas:', data);
        setYojnas(data.data);
      } catch (error) {
        console.error('Error fetching yojnas:', error);
        toast.error('Failed to load schemes');
      }
    };
    fetchYojnas();
  }, []);

  // Search properties based on criteria
  const handleSearch = async () => {
    if (!searchQuery || !selectedYojna) {
      toast.error('Please select a scheme and enter search criteria');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        yojna_id: selectedYojna,
      });
      
      // Add search parameter based on search type
      if (searchType !== 'sampatti_sreni') {
        params.append(searchType, searchQuery);
      } else {
        params.append('sampatti_sreni', searchQuery);
      }
      
      // Add floor type filter if BIDA MART is selected and floor type is specified
      if (selectedYojna === 'BID' && floorType) {
        params.append('property_floor_type', floorType);
      }

      const response = await fetch(`${BASE_URL}/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      
      const data = await response.json();
      
      // Transform the data to include payment details
      const properties = data.data.map((item: any) => {
        // Calculate next installment details if available
        let nextDueDate = null;
        let installmentAmount = 0;
        
        if (item.propertyRecordDetail && 
            item.propertyRecordDetail.first_installment_due_date && 
            item.propertyRecordDetail.ideal_kisht_mool) {
          
          const firstDueDate = new Date(item.propertyRecordDetail.first_installment_due_date.split('-').reverse().join('-'));
          const installmentsPaid = item.propertyRecordDetail.number_of_installment_paid || 0;
          const monthsToAdd = installmentsPaid * 3; // Assuming quarterly installments
          
          nextDueDate = new Date(firstDueDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + monthsToAdd);
          
          installmentAmount = parseFloat(item.propertyRecordDetail.ideal_kisht_mool) + 
                             parseFloat(item.propertyRecordDetail.ideal_kisht_byaj || 0);
        }
        
        // Calculate service charge amount based on floor type
        const serviceChargeAmount = item.propertyRecordDetail?.property_floor_type === 'LGF' ? 10610 : 11005;
        
        // Get current financial year
        const today = new Date();
        const currentYear = today.getFullYear();
        const financialYear = today.getMonth() < 3 ? 
          `${currentYear-1}-${currentYear}` : 
          `${currentYear}-${currentYear+1}`;
        
        return {
          property_unique_id: item.propertyRecordDetail.property_id,
          avanti_ka_naam: item.propertyRecords.avanti_ka_naam,
          mobile_no: item.propertyRecords.mobile_no,
          sampatti_sreni: item.propertyRecordDetail.sampatti_sreni,
          avanti_sampatti_sankhya: item.propertyRecordDetail.avanti_sampatti_sankhya,
          yojna_id: item.propertyRecords.yojna_id,
          yojna_name: item.propertyRecords.yojna_name,
          next_due_date: nextDueDate ? nextDueDate.toLocaleDateString('en-IN') : undefined,
          installment_amount: installmentAmount,
          service_charge_amount: serviceChargeAmount,
          financial_year: financialYear,
          property_floor_type: item.propertyRecordDetail.property_floor_type
        };
      });
      
      setSearchResults(properties);
    } catch (error) {
      console.error('Error searching properties:', error);
      toast.error('Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedProperty) return;
    
    setProcessingPayment(true);
    
    try {
      // In a real implementation, this would call your payment API
      // For now, we'll simulate a successful payment
      
      // Create receipt data
      const receipt = {
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        propertyId: selectedProperty.property_unique_id,
        propertyName: `${selectedProperty.sampatti_sreni} - ${selectedProperty.avanti_sampatti_sankhya}`,
        ownerName: selectedProperty.avanti_ka_naam,
        paymentType: 'installment', // Default to installment
        amount: paymentType === 'installment' 
          ? selectedProperty.installment_amount 
          : selectedProperty.service_charge_amount,
        date: new Date().toLocaleString('en-IN'),
        paymentMethod: 'Cash',
        status: 'Successful',
        details: paymentType === 'installment' 
          ? { installmentNumber: 1, dueDate: selectedProperty.next_due_date }
          : { financialYear: selectedProperty.financial_year }
      };
      
      setReceiptData(receipt);
      
      // Show success animation
      setTimeout(() => {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setShowSuccessAnimation(false);
          // Generate PDF after success animation
          setTimeout(() => {
            if (receiptRef.current) {
              generatePDF();
            }
          }, 500);
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const generatePDF = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`payment-receipt-${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate receipt PDF');
    }
  };

  const resetForm = () => {
    setReceiptData(null);
    setSelectedProperty(null);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Counter</h1>
            <p className="text-gray-600 dark:text-gray-400">Process payments for properties</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          {receiptData ? (
            <div className="max-w-2xl mx-auto">
              <div ref={receiptRef} className="bg-white p-6 rounded-lg border border-gray-200 shadow-md mb-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">BIDA Payment Receipt</h3>
                    <p className="text-sm text-gray-500">Transaction ID: {receiptData.transactionId}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {receiptData.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Property ID</p>
                    <p className="font-medium">{receiptData.propertyId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property</p>
                    <p className="font-medium">{receiptData.propertyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner Name</p>
                    <p className="font-medium">{receiptData.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date & Time</p>
                    <p className="font-medium">{receiptData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Type</p>
                    <p className="font-medium capitalize">{receiptData.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{receiptData.paymentMethod}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        {receiptData.paymentType === 'installment' ? 'Installment Details' : 'Service Charge Details'}
                      </p>
                      <p className="font-medium">
                        {receiptData.paymentType === 'installment' 
                          ? `Installment #${receiptData.details.installmentNumber} (Due: ${receiptData.details.dueDate})` 
                          : `Financial Year: ${receiptData.details.financialYear}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="text-xl font-bold text-green-600">₹{receiptData.amount?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                  <p>This is an official receipt of BIDA Property Management System.</p>
                  <p>Thank you for your payment.</p>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  New Payment
                </button>
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  {/* Search Filters */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Search Filters</h3>
                    
                    {/* Yojna Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Yojna
                      </label>
                      <select
                        value={selectedYojna}
                        onChange={(e) => setSelectedYojna(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select a yojna...</option>
                        {yojnas.map((yojna) => (
                          <option key={yojna.yojna_id} value={yojna.yojna_id}>
                            {yojna.yojna_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Search Type */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Search By
                      </label>
                      <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors mb-4"
                      >
                        <option value="name">Search by Owner Name</option>
                        <option value="phone">Search by Phone Number</option>
                        <option value="property_id">Property ID</option>
                        <option value="sampatti_sreni">Search by Sampatti Shreni</option>
                      </select>
                      
                      {/* Floor Type Filter (only for BIDA MART) */}
                      {selectedYojna === 'BID' && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Floor Type
                          </label>
                          <select
                            value={floorType}
                            onChange={(e) => setFloorType(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          >
                            <option value="">All Floor Types</option>
                            <option value="LGF">LGF</option>
                            <option value="UGF">UGF</option>
                            <option value="First Floor">First Floor</option>
                            <option value="Second Floor">Second Floor</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Search Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Search Term
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            // Clear selected property when search query changes
                            if (selectedProperty) setSelectedProperty(null);
                          }}
                          placeholder={`Enter ${searchType.replace('_', ' ')}...`}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      disabled={!searchQuery || !selectedYojna || loading}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                      Search
                    </button>
                  </div>
                  
                  {/* Selected Property Details */}
                  {selectedProperty && (
                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Details</h3>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Property</p>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white pl-6">
                            {selectedProperty.sampatti_sreni} - {selectedProperty.avanti_sampatti_sankhya}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner</p>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white pl-6">
                            {selectedProperty.avanti_ka_naam}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Installment Due Date
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white pl-6">
                            {selectedProperty.next_due_date || 'N/A'}
                          </p>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Financial Year
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white pl-6">
                            {selectedProperty.financial_year}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <IndianRupee className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Payment Amount
                            </p>
                          </div>
                          <p className="text-xl font-bold text-gray-900 dark:text-white pl-6">
                            ₹{selectedProperty.installment_amount?.toLocaleString('en-IN') || 'N/A'}
                          </p>
                        </div>
                        
                        <button
                          onClick={handleSubmitPayment}
                          disabled={processingPayment}
                          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {processingPayment ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <IndianRupee className="h-5 w-5" />
                              Process Payment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-2">
                  {/* Search Results */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search Results</h3>
                    </div>
                    
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Searching properties...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Property ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Owner Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Property Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Property Number
                              </th>
                              {selectedYojna === 'BID' && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Floor Type
                                </th>
                              )}
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {searchResults.map((property) => (
                              <tr key={property.property_unique_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {property.property_unique_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {property.avanti_ka_naam}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {property.sampatti_sreni}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {property.avanti_sampatti_sankhya}
                                </td>
                                {selectedYojna === 'BID' && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {property.property_floor_type || 'N/A'}
                                  </td>
                                )}
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
                    ) : searchQuery && !loading ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-4">
                          <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No properties found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                          No properties match your search criteria. Try adjusting your search or filters.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-4">
                          <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Search for a property</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                          Select a scheme and search by owner name, phone number, or property ID
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
    </DashboardLayout>
  );
}