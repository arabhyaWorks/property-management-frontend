
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { newAddProperty } from '../../services/api';
import { toast } from 'react-hot-toast';

interface FormStep {
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'file';
  options?: string[];
}

interface PaymentRecord {
  installmentAmount: number;
  installmentInterest: number;
  delayedInterestAmount: number;
  installmentDate: string;
}

interface ServiceChargeRecord {
  financialYear: string;
  amount: number;
  lateFee: number;
  date: string;
}

const formSteps: FormStep[] = [
  {
    title: 'Basic Information',
    fields: [
      { id: 'ownerPhotoPath', label: 'आवंटी ki photo (jpg/jpeg/png)', type: 'file' },
      { id: 'documentPath', label: 'आवंटी ka document (pdf)', type: 'file' },
      { id: 'schemeName', label: 'योजना का नाम', type: 'select', options: ['hariyanv', 'bidamart', 'pipris'] },
      { id: 'propertyCategory', label: 'आवंटित संपत्ति की श्रेणी', type: 'select', options: ['HGF','LGF'] },
      { id: 'shopNumber', label: 'shop no', type: 'number' },
      { id: 'allotteName', label: 'आवंटी का नाम', type: 'text' },
      { id: 'fatherHusbandName', label: 'पिता/पति का नाम', type: 'text' },
      { id: 'permanentAddress', label: 'आवंटी का स्थायी पता', type: 'text' },
      { id: 'currentAddress', label: 'आवंटी का वर्तमान पता', type: 'text' },
      { id: 'mobileNumber', label: 'मोबाइल नंबर', type: 'text' },
      { id: 'propertyNumber', label: 'आवंटित संपत्ति की संख्या', type: 'number' },
    ]
  },
  {
    title: 'Property Details',
    fields: [
      { id: 'registrationAmount', label: 'पंजीकरण धनराशि', type: 'number' },
      { id: 'registrationDate', label: 'पंजीकरण दिनांक', type: 'date' },
      { id: 'allotmentAmount', label: 'आवंटन धनराशि', type: 'number' },
      { id: 'allotmentDate', label: 'आवंटन दिनांक', type: 'date' },
      { id: 'salePrice', label: 'विक्रय मूल्य', type: 'number' },
      { id: 'eAuctionPrice', label: 'ई-आक्शन कीमत', type: 'number' },
      { id: 'freeholdAmount', label: 'फ्री होल्ड धनराशि', type: 'number' },
      { id: 'parkCharge', label: 'पार्क चार्ज', type: 'number' },
      { id: 'cornerCharge', label: 'कार्नर चार्ज', type: 'number' },
    ]
  },
  {
    title: 'Charges & Payments',
    fields: [
      { id: 'leaseRentAmount', label: 'लीज रेंट की धनराशि', type: 'number' },
      { id: 'remainingSalePriceLumpSum', label: 'अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि', type: 'number' },
      { id: 'remainingSalePriceInstallment', label: 'अवशेष विक्रय मूल किस्त धनराशि', type: 'number' },
      { id: 'interestAmount', label: 'ब्याज धनराशि', type: 'number' },
      { id: 'remainingInstallmentDate', label: 'दिनांक', type: 'date' },
      { id: 'areaSquareMeter', label: 'क्षेत्रफल (वर्ग मीटर)', type: 'number' },
      { id: 'possessionDate', label: 'कब्जा दिनांक', type: 'date' },
      { id: 'additionalLandAmount', label: 'अतिरिक्त भूमि की धनराशि', type: 'number' },
      { id: 'restorationCharges', label: 'पुनर्जीवित शुल्क', type: 'number' },
      { id: 'certificateCharges', label: 'प्रमाण पत्र शुल्क', type: 'number' },
    ]
  },
  {
    title: 'Payment History',
    fields: []
  },
  {
    title: 'Additional Details',
    fields: [
      { id: 'registrationCharges', label: 'निबंधन शुल्क', type: 'number' },
      { id: 'registrationDate2', label: 'निबंधन दिनांक', type: 'date' },
      { id: 'transferName', label: 'नामंतारी का नाम', type: 'text' },
      { id: 'transferorFatherHusbandName', label: 'नामंतारी के पिता/पति का नाम', type: 'text' },
      { id: 'transferorAddress', label: 'पता', type: 'text' },
      { id: 'inheritance', label: 'वरासत', type: 'text' },
      { id: 'transferCharges', label: 'नामांतरण शुल्क', type: 'number' },
      { id: 'documentationCharges', label: 'डॉक्यूमेंटेशन शुल्क', type: 'number' },
      { id: 'transferDate', label: 'नामांतरण दिनांक', type: 'date' },
      { id: 'buildingPlanApprovalDate', label: 'भवन मानचित्र स्वीकृति दिनांक', type: 'date' },
      { id: 'buildingConstruction', label: 'भवन निर्माण (हां/नहीं)', type: 'text' },
      { id: 'depositDateReceiptNumber', label: 'जमा धनराशि दिनांक व रसीद संख्या', type: 'date' },
      { id: 'changeFee', label: 'परिवर्तन शुल्क', type: 'number' },
      { id: 'advertisementFee', label: 'विज्ञापन शुल्क', type: 'number' },
      { id: 'landPrice', label: 'bhumi ki kimat', type: 'number' },
    ]
  },
  {
    title: 'Service Charges',
    fields: []
  },
];

interface AddPropertyFormProps {
  onClose: () => void;
}

export default function NewAddPropertyForm({ onClose }: AddPropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | null>>({});
  const [files, setFiles] = useState<{
    ownerPhotoPath: File | null;
    documentPath: File | null;
  }>({
    ownerPhotoPath: null,
    documentPath: null,
  });

  const getInstallmentAmount = ( registrationAmt , allotmentAmount, eAuctionPrice , registrationDate )=>{

    const avsheshDhanrashi = eAuctionPrice - (registrationAmt + allotmentAmount);

    const interestPrice = avsheshDhanrashi*12/100/2;

    const kulYug =  avsheshDhanrashi + interestPrice

    const timahiKisht = kulYug/4;

    const kishtMul = avsheshDhanrashi/4;

    const kishtByaj = interestPrice/4;

  } 

  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [serviceChargeHistory, setServiceChargeHistory] = useState<ServiceChargeRecord[]>([]);

    const getServiceCharge = (propertyCategory, financialYear) => {

    const serviceCharge = propertyCategory === "LGF" ? 10610 : propertyCategory === "HGF" ? 11005 : 0;
  
    if (!serviceCharge) {
      return { error: "Invalid property category" };
    }
  
    // Get the current financial year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentFinancialYear =
      currentDate.getMonth() < 3 ? `${currentYear - 1}-${currentYear}` : `${currentYear}-${currentYear + 1}`;
  
    // Determine the financial year offset (how far the selected year is from the current year)
    const selectedYear = parseInt(financialYear.split("-")[0]);
    const offset = parseInt(currentFinancialYear.split("-")[0]) - selectedYear;
  
    let totalCharge = serviceCharge;
    let lateFee = 0;
  
    // Calculate late fee based on the financial year offset
    switch (offset) {
      case 0: // Current Financial Year
        lateFee = 0;
        break;
      case 1: 
        lateFee = (5 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 2: 
        lateFee = (10 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 3: 
        lateFee = (15 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
        case 4: 
        lateFee = (20 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
        case 5: 
        lateFee = (25 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
        case 6: 
        lateFee = (30 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      default:
        if (offset > 6) {
          return { error: "Calculations for financial years beyond the last 6 are not supported." };
        }
        break;
    }
  
    return {
      propertyCategory,
      financialYear,
      serviceCharge: Math.ceil(serviceCharge),
      lateFee: Math.ceil(lateFee),
      totalCharge: Math.ceil(totalCharge),
      isCurrentYear: offset === 0
    };
  };

  
  const [newPayment, setNewPayment] = useState<PaymentRecord>({
    installmentAmount: 0,
    installmentInterest: 0,
    delayedInterestAmount: 0,
    installmentDate: ''
  });

 
  // const serviceChargeResult = getServiceCharge(formData.propertyCategory, newServiceCharge.financialYear);
  // console.log(serviceChargeResult ,  "serviceChargeResult");

  // const [newServiceCharge, setNewServiceCharge] = useState<ServiceChargeRecord>({
  //   financialYear: serviceChargeResult.financialYear,
  //   amount: serviceChargeResult.serviceCharge,
  //   lateFee: serviceChargeResult.lateFee,
  //   date: ''
  // });

  
  

  
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId: string, value: string | File) => {
    if (value instanceof File) { console.log(files , formData  , "checking files");
      if (fieldId === 'ownerPhotoPath' || fieldId === 'documentPath') {
        setFiles(prev => ({
          
          ...prev,
          [fieldId]: value
        } ));
        setFormData(prev => ({ ...prev, [fieldId]: value.name }));
        console.log(files , formData , "checking files");
        
      }
    } else {
      setFormData(prev => ({ ...prev, [fieldId]: value }));
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(formSteps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleAddPayment = () => {
    if (newPayment.installmentAmount && newPayment.installmentDate) {
      setPaymentHistory([...paymentHistory, newPayment]);
      setNewPayment({
        installmentAmount: 0,
        installmentInterest: 0,
        delayedInterestAmount: 0,
        installmentDate: ''
      });
    }
  };

  const handleAddServiceCharge = () => {
    if (newServiceCharge.financialYear && newServiceCharge.amount && newServiceCharge.date) {
      setServiceChargeHistory([...serviceChargeHistory, newServiceCharge]);
      setNewServiceCharge({
        financialYear: '',
        amount: 0,
        lateFee: 0,
        date: ''
      });
    }
  };

  const handleRemovePayment = (index: number) => {
    setPaymentHistory(paymentHistory.filter((_, i) => i !== index));
  };

  const handleRemoveServiceCharge = (index: number) => {
    setServiceChargeHistory(serviceChargeHistory.filter((_, i) => i !== index));
  };

  const schemeIdGenerator = (schemeNameVal)=>{
         if(schemeNameVal == 'hariyanv'){return 1}
         else if(schemeNameVal == 'bidamart'){return 2}
         else if(schemeNameVal == 'pipris'){return 3}
  }


 

// 2nd handle submit 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
   
//   if (serviceChargeHistory.length === 0) {
//     return;
//   }
  

  try {
    const fd = new FormData();

    // First append the files with correct field names
    if (files.ownerPhotoPath) {
      fd.append('ownerPhoto', files.ownerPhotoPath);
    }
    console.log('photo File:', files.ownerPhotoPath);
    if (files.documentPath) {
      fd.append('document', files.documentPath);
    }
    console.log('document File:', files.documentPath);

    // Convert form data to a data object and stringify it
    const data = {
      serialNumber :formData.serialNumber || 0,
      schemeName: formData.schemeName,
      schemeId: schemeIdGenerator(formData.schemeName),
      allotteName: formData.allotteName,
      fatherHusbandName: formData.fatherHusbandName,
      permanentAddress: formData.permanentAddress,
      currentAddress: formData.currentAddress,
      mobileNumber: formData.mobileNumber,
      propertyCategory: formData.propertyCategory,
      shopNumber: formData.shopNumber,
      propertyNumber: parseInt(formData.propertyNumber as string || '0'),
      registrationAmount: parseFloat(formData.registrationAmount as string || '0'),
      registrationDate: formData.registrationDate,
      allotmentAmount: parseFloat(formData.allotmentAmount as string || '0'),
      allotmentDate: formData.allotmentDate,
      salePrice: parseFloat(formData.salePrice as string || '0'),
      eAuctionPrice: parseFloat(formData.eAuctionPrice as string || '0'),
      freeholdAmount: parseFloat(formData.freeholdAmount as string || '0'),
      leaseRentAmount: parseFloat(formData.leaseRentAmount as string || '0'),
      parkCharge: parseFloat(formData.parkCharge as string || '0'),
      cornerCharge: parseFloat(formData.cornerCharge as string || '0'),
      remainingSalePriceLumpSum: parseFloat(formData.remainingSalePriceLumpSum as string || '0'),
      remainingSalePriceInstallment: parseFloat(formData.remainingSalePriceInstallment as string || '0'),
      interestAmount: parseFloat(formData.interestAmount as string || '0'),
      remainingInstallmentDate: formData.remainingInstallmentDate,
      areaSquareMeter: parseFloat(formData.areaSquareMeter as string || '0'),
      possessionDate: formData.possessionDate,
      additionalLandAmount: parseFloat(formData.additionalLandAmount as string || '0'),
      restorationCharges: parseFloat(formData.restorationCharges as string || '0'),
      certificateCharges: parseFloat(formData.certificateCharges as string || '0'),
      registrationCharges: parseFloat(formData.registrationCharges as string || '0'),
      registrationDate2: formData.registrationDate2,
      transferName: formData.transferName,
      transferorFatherHusbandName: formData.transferorFatherHusbandName,
      transferorAddress: formData.transferorAddress,
      inheritance: formData.inheritance,
      transferCharges: parseFloat(formData.transferCharges as string || '0'),
      documentationCharges: parseFloat(formData.documentationCharges as string || '0'),
      transferDate: formData.transferDate,
      buildingPlanApprovalDate: formData.buildingPlanApprovalDate,
      buildingConstruction: formData.buildingConstruction,
      depositDateReceiptNumber: formData.depositDateReceiptNumber,
      changeFee: parseFloat(formData.changeFee as string || '0'),
      advertisementFee: parseFloat(formData.advertisementFee as string || '0'),
      landPrice: parseFloat(formData.landPrice as string || '0'),
      paymentHistory,
      serviceChargeHistory,
    };

    console.log('Stringified data:', JSON.stringify(data));
    // Append the stringified data
    fd.append('formData', JSON.stringify(data));

    // Debug log
    console.log('Sending data:', data);
    console.log('Files:', files , fd);
    for (let [key, value] of fd.entries()) {
      console.log(`${key}:`, value , "fd data");
    }
    

    const response = await newAddProperty(fd);
    console.log('Response:', response);
    toast.success('Property added successfully');
    setIsSubmitting(false);
    onClose();
    setIsSubmitting(true); 
  } catch (error: any) {
    console.error('Error submitting form:', error);
    if (error.response) {
      // console.error('Error status:', error.response.status);
      console.error('Error in add property catcch block', error);
    }
    toast.error('Failed to add property. Please try again.');
    setIsSubmitting(false);
  }
};


 
  const renderServiceChargeStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h4 className="text-lg font-medium mb-4">Add Service Charge</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* <div>
            <label className="block text-sm font-medium mb-1">वित्तीय वर्ष</label>
            <input
              type="text"
              value={newServiceCharge.financialYear}
              onChange={(e) => setNewServiceCharge({
                ...newServiceCharge,
                financialYear: e.target.value
              })}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium mb-1">वित्तीय वर्ष</label>
            <select  className='w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500'
            value={newServiceCharge.financialYear}
            onChange={(e) => setNewServiceCharge({
              ...newServiceCharge,
              financialYear: e.target.value
            })}
            >
               <option value="" disabled>select year</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
              <option value="2021-2022">2021-2022</option>
              <option value="2020-2021">2020-2021</option>
              <option value="2019-2020">2019-2020</option>
              <option value="2019-2020">2018-2019</option>

            </select>
            
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">सर्विस चार्ज धनराशि</label>
            <input
              type="number" 
              value={newServiceCharge.amount}
              onChange={(e) => setNewServiceCharge({
                ...newServiceCharge,
                amount: parseFloat(e.target.value)
              })}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">विलंब शुल्क</label>
            <input
              type="number"
              value={newServiceCharge.lateFee}
              onChange={(e) => setNewServiceCharge({
                ...newServiceCharge,
                lateFee: parseFloat(e.target.value)
              })}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">दिनांक</label>
            <input
              type="date"
              value={newServiceCharge.date}
              onChange={(e) => setNewServiceCharge({
                ...newServiceCharge,
                date: e.target.value
              })}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddServiceCharge}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Service Charge
        </button>

        
      </div>

      {serviceChargeHistory.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">वित्तीय वर्ष</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">सर्विस चार्ज धनराशि</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब शुल्क</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceChargeHistory.map((charge, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">{charge.financialYear}</td>
                  <td className="px-6 py-4 text-sm">₹{charge.amount}</td>
                  <td className="px-6 py-4 text-sm">₹{charge.lateFee}</td>
                  <td className="px-6 py-4 text-sm">{charge.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      type="button"
                      onClick={() => handleRemoveServiceCharge(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-8">
            {formSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center relative mx-4"
                onClick={() => setCurrentStep(index)}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 border-2",
                  currentStep === index 
                    ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500" 
                    : index < currentStep
                    ? "bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-400"
                    : "bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                )}>
                  {index + 1}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {step.title}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={cn(
                    "w-20 h-0.5 mx-2 mt-4",
                    index < currentStep ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700",
                    "transition-all duration-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto px-2 mt-8 custom-scrollbar">
              {currentStep === 5 ? (
                renderServiceChargeStep()
              ) : currentStep === 3 ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-medium mb-4">Add Payment Record</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">किस्त जमा धनराशि</label>
                        <input
                          type="number"
                          value={newPayment.installmentAmount}
                          onChange={(e) => setNewPayment({
                            ...newPayment,
                            installmentAmount: parseFloat(e.target.value)
                          })}
                          className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">किस्त जमा ब्याज धनराशि</label>
                        <input
                          type="number"
                          value={newPayment.installmentInterest}
                          onChange={(e) => setNewPayment({
                            ...newPayment,
                            installmentInterest: parseFloat(e.target.value)
                          })}
                          className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">विलंब ब्याज धनराशि</label>
                        <input
                          type="number"
                          value={newPayment.delayedInterestAmount}
                          onChange={(e) => setNewPayment({
                            ...newPayment,
                            delayedInterestAmount: parseFloat(e.target.value)
                          })}
                          className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">दिनांक</label>
                        <input
                          type="date"
                          value={newPayment.installmentDate}
                          onChange={(e) => setNewPayment({
                            ...newPayment,
                            installmentDate: e.target.value
                          })}
                          className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPayment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Payment
                    </button>
                  </div>
                  
                  {paymentHistory.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा धनराशि</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा ब्याज धनराशि</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब ब्याज धनराशि</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentHistory.map((payment, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 text-sm">₹{payment.installmentAmount}</td>
                              <td className="px-6 py-4 text-sm">₹{payment.installmentInterest}</td>
                              <td className="px-6 py-4 text-sm">₹{payment.delayedInterestAmount}</td>
                              <td className="px-6 py-4 text-sm">{payment.installmentDate}</td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePayment(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {formSteps[currentStep].fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {field.label}
                        <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                      </label>
                      {field.type === 'file' ? (
                        <>
                          <input
                            type="file"
                            accept={field.id === 'ownerPhotoPath' ? 'image/*' : '.pdf'}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleInputChange(field.id, file);
                              }
                            }}
                          />
                          {files[field.id] && <p className="text-sm text-gray-500">{files[field.id]?.name}</p>}
                        </>
                      ) : field.type === 'select' ? (
                        <select
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          value={formData[field.id] || ''}
                        >
                          <option value="" className="dark:bg-gray-800">Select option...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option} className="dark:bg-gray-800">{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            

            <div className="mt-6 flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
                disabled={currentStep === 0}
              >
                Previous
              </button>
              {currentStep === formSteps.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
        </div>
        </div>
  )}



