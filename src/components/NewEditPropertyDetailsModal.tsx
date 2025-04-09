import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { updateProperty } from '../services/api';
import { toast } from 'react-hot-toast';


interface EditPropertyFormProps {
  property: any;
  onClose: () => void;
}

export default function NewEditPropertyForm({ property, onClose }: EditPropertyFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    // to add new property inputs 
    serialNumber: property?.serial_number || 0, 
    schemeName: property?.scheme_name || '',
    propertyCategory: property?.property_category || '',
    shopNumber : property?.shop_number || '',
    allotteName: property?.allottee_name || '',
    fatherHusbandName: property?.fathers_husbands_name || '',
    permanentAddress: property?.permanent_address || '',
    currentAddress: property?.current_address || '',
    mobileNumber: property?.mobile_number || '',
    propertyNumber: property?.property_number?.toString() || '',
    
    // Property Details
    registrationAmount: property?.registration_amount?.toString() || '',
    registrationDate: property?.registration_date || '',
    allotmentAmount: property?.allotment_amount?.toString() || '',
    allotmentDate: property?.allotment_date || '',
    salePrice: property?.sale_price?.toString() || '',
    eAuctionPrice: property?.e_auction_price?.toString() || '',
    // e-auction-price
    freeholdAmount: property?.freehold_amount?.toString() || '',
    parkCharge: property?.park_charge?.toString() || '',
    cornerCharge: property?.corner_charge?.toString() || '',
    
    // Charges & Payments
    leaseRentAmount: property?.lease_rent_amount?.toString() || '',
    remainingSalePriceLumpSum: property?.remaining_sale_price_lump_sum?.toString() || '',
    remainingSalePriceInstallment: property?.remaining_sale_price_installments?.toString() || '',
    interestAmount: property?.interest_amount?.toString() || '',
    remainingInstallmentDate: property?.remaining_installment_date || '',
    areaSquareMeter: property?.area_square_meter?.toString() || '',
    possessionDate: property?.possession_date || '',
    additionalLandAmount: property?.additional_land_amount?.toString() || '',
    restorationCharges: property?.restoration_charges?.toString() || '',
    certificateCharges: property?.certificate_charges?.toString() || '',
    
    // Additional Details
    registrationCharges: property?.registration_charges?.toString() || '',
    registrationDate2: property?.registration_date_2 || '',
    transferName: property?.transfer_name || '',
    transferorFatherHusbandName: property?.transferors_fathers_husbands_name || '',
    transferorAddress: property?.address || '',
    inheritance: property?.inheritance || '',
    transferCharges: property?.transfer_fee?.toString() || '',
    documentationCharges: property?.documentation_fee?.toString() || '',
    transferDate: property?.transfer_date || '',
    buildingPlanApprovalDate: property?.building_plan_approval_date || '',
    buildingConstruction: property?.building_construction || '',
    depositDateReceiptNumber: property?.deposit_date || '',
    changeFee: property?.change_fee?.toString() || '',
    advertisementFee: property?.advertisement_fee?.toString() || '',
    landPrice: property?.land_price?.toString() || '',
  });

  const [paymentHistory, setPaymentHistory] = useState(property?.paymentHistory || []);
  
const getInstallmentAmount = (
  installmentsArray,
  paymentHistoryArray,
  registrationAmt,
  allotmentAmount,
  eAuctionPrice,
  registrationDate
) => {
  
  const registrationAmount = parseFloat(registrationAmt);
  const allotmentAmt = parseFloat(allotmentAmount);
  const eAuctionAmt = parseFloat(eAuctionPrice);
  const regDate = new Date(registrationDate);

  
  const avsheshDhanrashi = eAuctionAmt - (registrationAmount + allotmentAmt);
  const interestPrice = (avsheshDhanrashi * 12) / 100 / 2; 
  const kulYug = avsheshDhanrashi + interestPrice;
  const timahiKisht = kulYug / 4; 
  const kishtMul = avsheshDhanrashi / 4; 
  const kishtByaj = interestPrice / 4; 

  
  const lateFeePerDay = (18 / 100) * timahiKisht / 365;

  
  const installmentDates = Array(4)
    .fill(null)
    .map((_, index) =>
      new Date(new Date(regDate).setMonth(regDate.getMonth() + index * 3))
    );

  
  let currentInstallmentIndex = installmentsArray.length;

  if (installmentsArray.length === paymentHistoryArray.length) {
    currentInstallmentIndex = installmentsArray.length;
  } else {
    currentInstallmentIndex = Math.max(installmentsArray.length, paymentHistoryArray.length);
  }

  if (currentInstallmentIndex >= 4) {
    return {
      message: "All installments have been paid",
      totalLateFee: 0,
      perDayLateFee: 0,
    };
  }


  const currentInstallmentDate = installmentDates[currentInstallmentIndex];
  const currentDate = new Date();
  const daysLate = Math.max(0, Math.floor((currentDate - currentInstallmentDate) / (1000 * 60 * 60 * 24)));


  const totalLateFee = lateFeePerDay * daysLate;

  return {
    message: `Installment ${currentInstallmentIndex + 1} calculation`,
    timahiKisht,
    kishtMul,
    kishtByaj,
    lateFeePerDay,
    totalLateFee,
    daysLate,
  };
};



useEffect(() => {
  const installmentResult = getInstallmentAmount( 
    property.installments, paymentHistory, property.registration_amount , property.allotment_amount , property.e_auction_price 
    , property.registration_date)
    console.log('in useEffect' , installmentResult);
    
}, [formData]);

const installmentResult = getInstallmentAmount( 
  property.installments, paymentHistory, property.registration_amount , property.allotment_amount , property.e_auction_price 
  , property.registration_date)

  // const [paymentHistory, setPaymentHistory] = useState([]);
  const [serviceChargeHistory, setServiceChargeHistory] = useState(property?.serviceChargeHistory || []);
  const [newPayment, setNewPayment] = useState({
    installmentAmount: installmentResult.timahiKisht,
    installmentInterest: installmentResult.kishtByaj,
    delayedInterestAmount: installmentResult.totalLateFee,
    installmentDate: ''
  });
  const [newServiceCharge, setNewServiceCharge] = useState({
    financialYear: '',
    amount: 0,
    lateFee: 0,
    date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // old addpayment function
  // const handleAddPayment = () => {
  //   if (newPayment.installmentInterest && newPayment.installmentDate) {
  //     setPaymentHistory([...paymentHistory, newPayment]);
  //     setNewPayment({
  //       installmentAmount: 0,
  //       installmentInterest: 0,
  //       delayedInterestAmount: 0,
  //       installmentDate: '',
  //     });
  //   }
  // };


  const handleAddPayment = () => {
    if (
      installmentResult.timahiKisht &&
      installmentResult.kishtByaj 
    ) {
      const paymentEntry = {
        installmentAmount: installmentResult.timahiKisht,
        installmentInterest: installmentResult.kishtByaj,
        delayedInterestAmount: installmentResult.totalLateFee || 0,
        installmentDate: newPayment.installmentDate
      };
      setPaymentHistory([...paymentHistory, paymentEntry]);
    } else {
      alert("Please complete all fields before adding a payment.");
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

  const dateFormating = (date:any)=>{
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 10);
  }
  const schemeIdGenerator = (schemeNameVal)=>{
    if(schemeNameVal == 'hariyanv'){return 1}
    else if(schemeNameVal == 'bidamart'){return 2}
    else if(schemeNameVal == 'pipris'){return 3}
}



//  const getInstallmentAmount = ( installmentsArray , paymentHistoryArray , registrationAmt , allotmentAmount, eAuctionPrice , registrationDate )=>{

//     const avsheshDhanrashi = eAuctionPrice - (registrationAmt + allotmentAmount);

//     const interestPrice = avsheshDhanrashi*12/100/2;

//     const kulYug =  avsheshDhanrashi + interestPrice

//     const timahiKisht = kulYug/4;

//     const kishtMul = avsheshDhanrashi/4;

//     const kishtByaj = interestPrice/4;

//   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedData = {
        ...formData,
        // schemeName: formData.schemeName,
        // propertyCategory: formData.propertyCategory,
        // allotteName: formData.allotteName,
        // fatherHusbandName: formData.fatherHusbandName,
        // permanentAddress: formData.permanentAddress,
        // currentAddress: formData.currentAddress,
        // mobileNumber: formData.mobileNumber,
        
        // (to be convert in number) data is here
        serialNumber : parseFloat(formData.serialNumber),
        schemeId : schemeIdGenerator(formData.schemeName),
        propertyNumber: parseInt(formData.propertyNumber),
        registrationAmount: parseFloat(formData.registrationAmount),
        allotmentAmount: parseFloat(formData.allotmentAmount),
        salePrice: parseFloat(formData.salePrice),
        eAuctionPrice: parseFloat(formData.eAuctionPrice),
        freeholdAmount: parseFloat(formData.freeholdAmount),
        parkCharge: parseFloat(formData.parkCharge),
        cornerCharge: parseFloat(formData.cornerCharge),
        leaseRentAmount: parseFloat(formData.leaseRentAmount),
        remainingSalePriceLumpSum: parseFloat(formData.remainingSalePriceLumpSum),
        remainingSalePriceInstallment: parseFloat(formData.remainingSalePriceInstallment),
        interestAmount: parseFloat(formData.interestAmount),
        areaSquareMeter: parseFloat(formData.areaSquareMeter),
        additionalLandAmount: parseFloat(formData.additionalLandAmount),
        restorationCharges: parseFloat(formData.restorationCharges),
        certificateCharges: parseFloat(formData.certificateCharges),
        registrationCharges: parseFloat(formData.registrationCharges),
        transferCharges: parseFloat(formData.transferCharges),
        documentationCharges: parseFloat(formData.documentationCharges),
        changeFee: parseFloat(formData.changeFee),
        advertisementFee: parseFloat(formData.advertisementFee),
        landPrice : parseFloat(formData.landPrice),
        
        // date objects here
        registrationDate: dateFormating(formData.registrationDate),
        allotmentDate : dateFormating(formData.allotmentDate),
        buildingPlanApprovalDate : dateFormating(formData.buildingPlanApprovalDate),
        depositDateReceiptNumber : dateFormating(formData.depositDateReceiptNumber),
        possessionDate : dateFormating(formData.possessionDate),
        registrationDate2 : dateFormating(formData.registrationDate2),
        remainingInstallmentDate : dateFormating(formData.remainingInstallmentDate),
        transferDate : dateFormating(formData.transferDate),


        paymentHistory,
        serviceChargeHistory,
      };

      await updateProperty(property.id, updatedData);
      toast.success('Property updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Property</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">योजना का नाम</label>
                <select
                  name="schemeName"
                  value={formData.schemeName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select...</option>
                  <option value="hariyanv">Hariyanv</option>
                  <option value="bidamart">Bidamart</option>
                  <option value="pipris">Pipris</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">आवंटित संपत्ति की श्रेणी</label>
                <select
                  name="propertyCategory"
                  value={formData.propertyCategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select...</option>
                  <option value="HIG">HIG</option>
                  <option value="MIG">MIG</option>
                  <option value="LIG">LIG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shop No</label>
                <input
                  type="text"
                  name="shopNumber"
                  value={formData.shopNumber}
                  onChange={handleInputChange}
                  className ="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">आवंटी का नाम</label>
                <input
                  type="text"
                  name="allotteName"
                  value={formData.allotteName}
                  onChange={handleInputChange}
                  className ="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">पिता/पति का नाम</label>
                <input
                  type="text"
                  name="fatherHusbandName"
                  value={formData.fatherHusbandName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्थायी पता</label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">वर्तमान पता</label>
                <input
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">मोबाइल नंबर</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">संपत्ति संख्या</label>
                <input
                  type="number"
                  name="propertyNumber"
                  value={formData.propertyNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">पंजीकरण धनराशि</label>
                <input
                  type="number"
                  name="registrationAmount"
                  value={formData.registrationAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">पंजीकरण दिनांक</label>
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">आवंटन धनराशि</label>
                <input
                  type="number"
                  name="allotmentAmount"
                  value={formData.allotmentAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">आवंटन दिनांक</label>
                <input
                  type="date"
                  name="allotmentDate"
                  value={formData.allotmentDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">विक्रय धनराशि</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ई-आक्शन कीमत</label>
                <input
                  type="number"
                  name="eAuctionPrice"
                  value={formData.eAuctionPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">फ्री होल्ड धनराशि</label>
                <input
                  type="number"
                  name="freeholdAmount"
                  value={formData.freeholdAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">पार्क चार्ज</label>
                <input
                  type="number"
                  name="parkCharge"
                  value={formData.parkCharge}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">कार्नर चार्ज</label>
                <input
                  type="number"
                  name="cornerCharge"
                  value={formData.cornerCharge}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Charges & Payments */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Charges & Payments</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">लीज़ रेंट राशि</label>
                <input
                  type="number"
                  name="leaseRentAmount"
                  value={formData.leaseRentAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">बकाया बिक्री मूल्य (लंपसम)</label>
                <input
                  type="number"
                  name="remainingSalePriceLumpSum"
                  value={formData.remainingSalePriceLumpSum}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">बकाया बिक्री मूल्य (किस्त)</label>
                <input
                  type="number"
                  name="remainingSalePriceInstallment"
                  value={formData.remainingSalePriceInstallment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ब्याज राशि</label>
                <input
                  type="number"
                  name="interestAmount"
                  value={formData.interestAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">बकाया किस्त की तारीख</label>
                <input
                  type="date"
                  name="remainingInstallmentDate"
                  value={formData.remainingInstallmentDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">क्षेत्र (वर्ग मीटर)</label>
                <input
                  type="number"
                  name="areaSquareMeter"
                  value={formData.areaSquareMeter}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्वामित्व की तारीख</label>
                <input
                  type="date"
                  name="possessionDate"
                  value={formData.possessionDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">अतिरिक्त भूमि राशि</label>
                <input
                  type="number"
                  name="additionalLandAmount"
                  value={formData.additionalLandAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">पुनर्स्थापन शुल्क</label>
                <input
                  type="number"
                  name="restorationCharges"
                  value={formData.restorationCharges}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">प्रमाण पत्र शुल्क</label>
                <input
                  type="number"
                  name="certificateCharges"
                  value={formData.certificateCharges}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Additional Details</h3>
            <div className=" grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">पंजीकरण शुल्क</label>
                <input
                  type="number"
                  name="registrationCharges"
                  value={formData.registrationCharges}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">पंजीकरण दिनांक 2</label>
                <input
                  type="date"
                  name="registrationDate2"
                  value={formData.registrationDate2}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्थानांतरण का नाम</label>
                <input
                  type="text"
                  name="transferName"
                  value={formData.transferName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्थानांतरणकर्ता पिता/पति का नाम</label>
                <input
                  type="text"
                  name="transferorFatherHusbandName"
                  value={formData.transferorFatherHusbandName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्थानांतरणकर्ता का पता</label>
                <input
                  type="text"
                  name="transferorAddress"
                  value={formData.transferorAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">विरासत</label>
                <input
                  type="text"
                  name="inheritance"
                  value={formData.inheritance}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्थानांतरण शुल्क</label>
                <input
                  type="number"
                  name="transferCharges"
                  value={formData.transferCharges}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">प्रलेखन शुल्क</label>
                <input
                  type="number"
                  name="documentationCharges"
                  value={formData.documentationCharges}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">स्थानांतरण दिनांक</label>
                <input
                  type="date"
                  name="transferDate"
                  value={formData.transferDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">भवन योजना अनुमोदन दिनांक</label>
                <input
                  type="date"
                  name="buildingPlanApprovalDate"
                  value={formData.buildingPlanApprovalDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">भवन निर्माण</label>
                <input
                  type="text"
                  name="buildingConstruction"
                  value={formData.buildingConstruction}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">जमा दिनांक/रसीद संख्या</label>
                <input
                  type="text"
                  name="depositDateReceiptNumber"
                  value={formData.depositDateReceiptNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">परिवर्तन शुल्क</label>
                <input
                  type="number"
                  name="changeFee"
                  value={formData.changeFee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">विज्ञापन शुल्क</label>
                <input
                  type="number"
                  name="advertisementFee"
                  value={formData.advertisementFee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">bhumi ki kimat</label>
                <input
                  type="number"
                  name="landPrice"
                  value={formData.landPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Payment History */}
          {/* <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Payment History</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddPayment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Payment
              </button>
            </div>

            {paymentHistory.length > 0 && (
              <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा धनराशि</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा ब्याज धनराशि</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब ब्याज धनराशि</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">₹{payment.installmentAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{payment.installmentInterest}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{payment.delayedInterestAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.installmentDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRemovePayment(index)}
                            className="text-red- 600 hover:text-red-900"
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
          </div> */}
          <div className="mb-8">
  <h3 className="text-lg font-medium mb-4">Payment History</h3>
  <div className="bg-gray-50 p-4 rounded-lg mb-4">
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">किस्त जमा धनराशि</label>
        <input
          type="number"
          value={installmentResult.timahiKisht} // Data from getInstallment function
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">किस्त जमा ब्याज धनराशि</label>
        <input
          type="number"
          value={installmentResult.kishtByaj} // Data from getInstallment function
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">विलंब ब्याज धनराशि</label>
        <input
          type="number"
          value={installmentResult.totalLateFee} // Data from getInstallment function
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">दिनांक</label>
        <input
          type="date"
          value={newPayment.installmentDate}
          onChange={(e) =>
            setNewPayment({ ...newPayment, installmentDate: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
    <button
      type="button"
      onClick={handleAddPayment}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add Payment
    </button>
  </div>

  {paymentHistory.length > 0 && (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा धनराशि</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा ब्याज धनराशि</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब ब्याज धनराशि</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paymentHistory.map((payment, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">₹{payment.installmentAmount}</td>
              <td className="px-6 py-4 whitespace-nowrap">₹{payment.installmentInterest}</td>
              <td className="px-6 py-4 whitespace-nowrap">₹{payment.delayedInterestAmount}</td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.installmentDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleRemovePayment(index)}
                  className="text-red-600 hover:text-red-900"
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


          {/* Service Charges */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Service Charges</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">वित्तीय वर्ष</label>
                  <input
                    type="text"
                    value={newServiceCharge.financialYear}
                    onChange={(e) => setNewServiceCharge({
                      ...newServiceCharge,
                      financialYear: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  />
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddServiceCharge}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Service Charge
              </button>
            </div>

            {serviceChargeHistory.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">वित्तीय वर्ष</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">सर्विस चार्ज धनराशि</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब शुल्क</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceChargeHistory.map((charge, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{charge.financialYear}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{charge.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{charge.lateFee}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{charge.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceCharge(index)}
                            className="text-red-600 hover:text-red-900"
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py- 2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// old edit code. everything is working. going to add installment calculator function above.
// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import { newUpdateProperty } from '../services/api';
// import { toast } from 'react-hot-toast';


// interface EditPropertyFormProps {
//   property: any;
//   onClose: () => void;
// }

// export default function NewEditPropertyForm({ property, onClose }: EditPropertyFormProps) {
//   const [formData, setFormData] = useState({
//     // Basic Information
//     // to add new property inputs 
//     serialNumber: property?.serial_number || 0, 
//     schemeName: property?.scheme_name || '',
//     propertyCategory: property?.property_category || '',
//     shopNumber : property?.shop_number || '',
//     allotteName: property?.allottee_name || '',
//     fatherHusbandName: property?.fathers_husbands_name || '',
//     permanentAddress: property?.permanent_address || '',
//     currentAddress: property?.current_address || '',
//     mobileNumber: property?.mobile_number || '',
//     propertyNumber: property?.property_number?.toString() || '',
    
//     // Property Details
//     registrationAmount: property?.registration_amount?.toString() || '',
//     registrationDate: property?.registration_date || '',
//     allotmentAmount: property?.allotment_amount?.toString() || '',
//     allotmentDate: property?.allotment_date || '',
//     salePrice: property?.sale_price?.toString() || '',
//     eAuctionPrice: property?.e_auction_price?.toString() || '',
//     // e-auction-price
//     freeholdAmount: property?.freehold_amount?.toString() || '',
//     parkCharge: property?.park_charge?.toString() || '',
//     cornerCharge: property?.corner_charge?.toString() || '',
    
//     // Charges & Payments
//     leaseRentAmount: property?.lease_rent_amount?.toString() || '',
//     remainingSalePriceLumpSum: property?.remaining_sale_price_lump_sum?.toString() || '',
//     remainingSalePriceInstallment: property?.remaining_sale_price_installments?.toString() || '',
//     interestAmount: property?.interest_amount?.toString() || '',
//     remainingInstallmentDate: property?.remaining_installment_date || '',
//     areaSquareMeter: property?.area_square_meter?.toString() || '',
//     possessionDate: property?.possession_date || '',
//     additionalLandAmount: property?.additional_land_amount?.toString() || '',
//     restorationCharges: property?.restoration_charges?.toString() || '',
//     certificateCharges: property?.certificate_charges?.toString() || '',
    
//     // Additional Details
//     registrationCharges: property?.registration_charges?.toString() || '',
//     registrationDate2: property?.registration_date_2 || '',
//     transferName: property?.transfer_name || '',
//     transferorFatherHusbandName: property?.transferors_fathers_husbands_name || '',
//     transferorAddress: property?.address || '',
//     inheritance: property?.inheritance || '',
//     transferCharges: property?.transfer_fee?.toString() || '',
//     documentationCharges: property?.documentation_fee?.toString() || '',
//     transferDate: property?.transfer_date || '',
//     buildingPlanApprovalDate: property?.building_plan_approval_date || '',
//     buildingConstruction: property?.building_construction || '',
//     depositDateReceiptNumber: property?.deposit_date || '',
//     changeFee: property?.change_fee?.toString() || '',
//     advertisementFee: property?.advertisement_fee?.toString() || '',
//     landPrice: property?.land_price?.toString() || '',
//   });

//   const [paymentHistory, setPaymentHistory] = useState(property?.paymentHistory || []);
//   const [serviceChargeHistory, setServiceChargeHistory] = useState(property?.serviceChargeHistory || []);
//   const [newPayment, setNewPayment] = useState({
//     installmentAmount: 0,
//     installmentInterest: 0,
//     delayedInterestAmount: 0,
//     installmentDate: ''
//   });
//   const [newServiceCharge, setNewServiceCharge] = useState({
//     financialYear: '',
//     amount: 0,
//     lateFee: 0,
//     date: ''
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddPayment = () => {
//     if (newPayment.installmentInterest && newPayment.installmentDate) {
//       setPaymentHistory([...paymentHistory, newPayment]);
//       setNewPayment({
//         installmentAmount: 0,
//         installmentInterest: 0,
//         delayedInterestAmount: 0,
//         installmentDate: '',
//       });
//     }
//   };

//   const handleAddServiceCharge = () => {
//     if (newServiceCharge.financialYear && newServiceCharge.amount && newServiceCharge.date) {
//       setServiceChargeHistory([...serviceChargeHistory, newServiceCharge]);
//       setNewServiceCharge({
//         financialYear: '',
//         amount: 0,
//         lateFee: 0,
//         date: ''
//       });
//     }
//   };

//   const handleRemovePayment = (index: number) => {
//     setPaymentHistory(paymentHistory.filter((_, i) => i !== index));
//   };

//   const handleRemoveServiceCharge = (index: number) => {
//     setServiceChargeHistory(serviceChargeHistory.filter((_, i) => i !== index));
//   };

//   const dateFormating = (date:any)=>{
//     if (!date) return null;
//     return new Date(date).toISOString().slice(0, 10);
//   }
//   const schemeIdGenerator = (schemeNameVal)=>{
//     if(schemeNameVal == 'hariyanv'){return 1}
//     else if(schemeNameVal == 'bidamart'){return 2}
//     else if(schemeNameVal == 'pipris'){return 3}
// }

// // const getServiceChargeAmt = ( propCategory , year , )=>{
    
// //   }

//  const getInstallmentAmount = ( paymentHistoryArray , registrationAmt , allotmentAmount, eAuctionPrice , registrationDate )=>{

//     const avsheshDhanrashi = eAuctionPrice - (registrationAmt + allotmentAmount);

//     const interestPrice = avsheshDhanrashi*12/100/2;

//     const kulYug =  avsheshDhanrashi + interestPrice

//     const timahiKisht = kulYug/4;

//     const kishtMul = avsheshDhanrashi/4;

//     const kishtByaj = interestPrice/4;

//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       const updatedData = {
//         ...formData,
//         // schemeName: formData.schemeName,
//         // propertyCategory: formData.propertyCategory,
//         // allotteName: formData.allotteName,
//         // fatherHusbandName: formData.fatherHusbandName,
//         // permanentAddress: formData.permanentAddress,
//         // currentAddress: formData.currentAddress,
//         // mobileNumber: formData.mobileNumber,
        
//         // (to be convert in number) data is here
//         serialNumber : parseFloat(formData.serialNumber),
//         schemeId : schemeIdGenerator(formData.schemeName),
//         propertyNumber: parseInt(formData.propertyNumber),
//         registrationAmount: parseFloat(formData.registrationAmount),
//         allotmentAmount: parseFloat(formData.allotmentAmount),
//         salePrice: parseFloat(formData.salePrice),
//         eAuctionPrice: parseFloat(formData.eAuctionPrice),
//         freeholdAmount: parseFloat(formData.freeholdAmount),
//         parkCharge: parseFloat(formData.parkCharge),
//         cornerCharge: parseFloat(formData.cornerCharge),
//         leaseRentAmount: parseFloat(formData.leaseRentAmount),
//         remainingSalePriceLumpSum: parseFloat(formData.remainingSalePriceLumpSum),
//         remainingSalePriceInstallment: parseFloat(formData.remainingSalePriceInstallment),
//         interestAmount: parseFloat(formData.interestAmount),
//         areaSquareMeter: parseFloat(formData.areaSquareMeter),
//         additionalLandAmount: parseFloat(formData.additionalLandAmount),
//         restorationCharges: parseFloat(formData.restorationCharges),
//         certificateCharges: parseFloat(formData.certificateCharges),
//         registrationCharges: parseFloat(formData.registrationCharges),
//         transferCharges: parseFloat(formData.transferCharges),
//         documentationCharges: parseFloat(formData.documentationCharges),
//         changeFee: parseFloat(formData.changeFee),
//         advertisementFee: parseFloat(formData.advertisementFee),
//         landPrice : parseFloat(formData.landPrice),
        
//         // date objects here
//         registrationDate: dateFormating(formData.registrationDate),
//         allotmentDate : dateFormating(formData.allotmentDate),
//         buildingPlanApprovalDate : dateFormating(formData.buildingPlanApprovalDate),
//         depositDateReceiptNumber : dateFormating(formData.depositDateReceiptNumber),
//         possessionDate : dateFormating(formData.possessionDate),
//         registrationDate2 : dateFormating(formData.registrationDate2),
//         remainingInstallmentDate : dateFormating(formData.remainingInstallmentDate),
//         transferDate : dateFormating(formData.transferDate),


//         paymentHistory,
//         serviceChargeHistory,
//       };

//       await newUpdateProperty(property.id, updatedData);
//       toast.success('Property updated successfully');
//       onClose();
//     } catch (error) {
//       console.error('Error updating property:', error);
//       toast.error('Failed to update property');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
//         <div className="px-6 py-4 border-b flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Edit Property</h2>
//           <button onClick={onClose}>
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//           {/* Basic Information */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Basic Information</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">योजना का नाम</label>
//                 <select
//                   name="schemeName"
//                   value={formData.schemeName}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="">Select...</option>
//                   <option value="hariyanv">Hariyanv</option>
//                   <option value="bidamart">Bidamart</option>
//                   <option value="pipris">Pipris</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">आवंटित संपत्ति की श्रेणी</label>
//                 <select
//                   name="propertyCategory"
//                   value={formData.propertyCategory}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="">Select...</option>
//                   <option value="HIG">HIG</option>
//                   <option value="MIG">MIG</option>
//                   <option value="LIG">LIG</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Shop No</label>
//                 <input
//                   type="text"
//                   name="shopNumber"
//                   value={formData.shopNumber}
//                   onChange={handleInputChange}
//                   className ="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">आवंटी का नाम</label>
//                 <input
//                   type="text"
//                   name="allotteName"
//                   value={formData.allotteName}
//                   onChange={handleInputChange}
//                   className ="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">पिता/पति का नाम</label>
//                 <input
//                   type="text"
//                   name="fatherHusbandName"
//                   value={formData.fatherHusbandName}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्थायी पता</label>
//                 <input
//                   type="text"
//                   name="permanentAddress"
//                   value={formData.permanentAddress}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">वर्तमान पता</label>
//                 <input
//                   type="text"
//                   name="currentAddress"
//                   value={formData.currentAddress}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">मोबाइल नंबर</label>
//                 <input
//                   type="text"
//                   name="mobileNumber"
//                   value={formData.mobileNumber}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">संपत्ति संख्या</label>
//                 <input
//                   type="number"
//                   name="propertyNumber"
//                   value={formData.propertyNumber}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Property Details */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Property Details</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">पंजीकरण धनराशि</label>
//                 <input
//                   type="number"
//                   name="registrationAmount"
//                   value={formData.registrationAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">पंजीकरण दिनांक</label>
//                 <input
//                   type="date"
//                   name="registrationDate"
//                   value={formData.registrationDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">आवंटन धनराशि</label>
//                 <input
//                   type="number"
//                   name="allotmentAmount"
//                   value={formData.allotmentAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">आवंटन दिनांक</label>
//                 <input
//                   type="date"
//                   name="allotmentDate"
//                   value={formData.allotmentDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">विक्रय धनराशि</label>
//                 <input
//                   type="number"
//                   name="salePrice"
//                   value={formData.salePrice}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">ई-आक्शन कीमत</label>
//                 <input
//                   type="number"
//                   name="eAuctionPrice"
//                   value={formData.eAuctionPrice}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">फ्री होल्ड धनराशि</label>
//                 <input
//                   type="number"
//                   name="freeholdAmount"
//                   value={formData.freeholdAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">पार्क चार्ज</label>
//                 <input
//                   type="number"
//                   name="parkCharge"
//                   value={formData.parkCharge}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">कार्नर चार्ज</label>
//                 <input
//                   type="number"
//                   name="cornerCharge"
//                   value={formData.cornerCharge}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Charges & Payments */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Charges & Payments</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">लीज़ रेंट राशि</label>
//                 <input
//                   type="number"
//                   name="leaseRentAmount"
//                   value={formData.leaseRentAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">बकाया बिक्री मूल्य (लंपसम)</label>
//                 <input
//                   type="number"
//                   name="remainingSalePriceLumpSum"
//                   value={formData.remainingSalePriceLumpSum}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">बकाया बिक्री मूल्य (किस्त)</label>
//                 <input
//                   type="number"
//                   name="remainingSalePriceInstallment"
//                   value={formData.remainingSalePriceInstallment}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">ब्याज राशि</label>
//                 <input
//                   type="number"
//                   name="interestAmount"
//                   value={formData.interestAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">बकाया किस्त की तारीख</label>
//                 <input
//                   type="date"
//                   name="remainingInstallmentDate"
//                   value={formData.remainingInstallmentDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">क्षेत्र (वर्ग मीटर)</label>
//                 <input
//                   type="number"
//                   name="areaSquareMeter"
//                   value={formData.areaSquareMeter}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्वामित्व की तारीख</label>
//                 <input
//                   type="date"
//                   name="possessionDate"
//                   value={formData.possessionDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">अतिरिक्त भूमि राशि</label>
//                 <input
//                   type="number"
//                   name="additionalLandAmount"
//                   value={formData.additionalLandAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">पुनर्स्थापन शुल्क</label>
//                 <input
//                   type="number"
//                   name="restorationCharges"
//                   value={formData.restorationCharges}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">प्रमाण पत्र शुल्क</label>
//                 <input
//                   type="number"
//                   name="certificateCharges"
//                   value={formData.certificateCharges}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Additional Details */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Additional Details</h3>
//             <div className=" grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">पंजीकरण शुल्क</label>
//                 <input
//                   type="number"
//                   name="registrationCharges"
//                   value={formData.registrationCharges}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">पंजीकरण दिनांक 2</label>
//                 <input
//                   type="date"
//                   name="registrationDate2"
//                   value={formData.registrationDate2}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्थानांतरण का नाम</label>
//                 <input
//                   type="text"
//                   name="transferName"
//                   value={formData.transferName}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्थानांतरणकर्ता पिता/पति का नाम</label>
//                 <input
//                   type="text"
//                   name="transferorFatherHusbandName"
//                   value={formData.transferorFatherHusbandName}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्थानांतरणकर्ता का पता</label>
//                 <input
//                   type="text"
//                   name="transferorAddress"
//                   value={formData.transferorAddress}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">विरासत</label>
//                 <input
//                   type="text"
//                   name="inheritance"
//                   value={formData.inheritance}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्थानांतरण शुल्क</label>
//                 <input
//                   type="number"
//                   name="transferCharges"
//                   value={formData.transferCharges}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">प्रलेखन शुल्क</label>
//                 <input
//                   type="number"
//                   name="documentationCharges"
//                   value={formData.documentationCharges}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">स्थानांतरण दिनांक</label>
//                 <input
//                   type="date"
//                   name="transferDate"
//                   value={formData.transferDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">भवन योजना अनुमोदन दिनांक</label>
//                 <input
//                   type="date"
//                   name="buildingPlanApprovalDate"
//                   value={formData.buildingPlanApprovalDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">भवन निर्माण</label>
//                 <input
//                   type="text"
//                   name="buildingConstruction"
//                   value={formData.buildingConstruction}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">जमा दिनांक/रसीद संख्या</label>
//                 <input
//                   type="text"
//                   name="depositDateReceiptNumber"
//                   value={formData.depositDateReceiptNumber}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">परिवर्तन शुल्क</label>
//                 <input
//                   type="number"
//                   name="changeFee"
//                   value={formData.changeFee}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">विज्ञापन शुल्क</label>
//                 <input
//                   type="number"
//                   name="advertisementFee"
//                   value={formData.advertisementFee}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">bhumi ki kimat</label>
//                 <input
//                   type="number"
//                   name="landPrice"
//                   value={formData.landPrice}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Payment History */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Payment History</h3>
//             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">किस्त जमा धनराशि</label>
//                   <input
//                     type="number"
//                     value={newPayment.installmentAmount}
//                     onChange={(e) => setNewPayment({
//                       ...newPayment,
//                       installmentAmount: parseFloat(e.target.value)
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">किस्त जमा ब्याज धनराशि</label>
//                   <input
//                     type="number"
//                     value={newPayment.installmentInterest}
//                     onChange={(e) => setNewPayment({
//                       ...newPayment,
//                       installmentInterest: parseFloat(e.target.value)
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">विलंब ब्याज धनराशि</label>
//                   <input
//                     type="number"
//                     value={newPayment.delayedInterestAmount}
//                     onChange={(e) => setNewPayment({
//                       ...newPayment,
//                       delayedInterestAmount: parseFloat(e.target.value)
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">दिनांक</label>
//                   <input
//                     type="date"
//                     value={newPayment.installmentDate}
//                     onChange={(e) => setNewPayment({
//                       ...newPayment,
//                       installmentDate: e.target.value
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleAddPayment}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Add Payment
//               </button>
//             </div>

//             {paymentHistory.length > 0 && (
//               <div className="overflow-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा धनराशि</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा ब्याज धनराशि</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब ब्याज धनराशि</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paymentHistory.map((payment, index) => (
//                       <tr key={index}>
//                         <td className="px-6 py-4 whitespace-nowrap">₹{payment.installmentAmount}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">₹{payment.installmentInterest}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">₹{payment.delayedInterestAmount}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">{payment.installmentDate}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => handleRemovePayment(index)}
//                             className="text-red- 600 hover:text-red-900"
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Service Charges */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Service Charges</h3>
//             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">वित्तीय वर्ष</label>
//                   <input
//                     type="text"
//                     value={newServiceCharge.financialYear}
//                     onChange={(e) => setNewServiceCharge({
//                       ...newServiceCharge,
//                       financialYear: e.target.value
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">सर्विस चार्ज धनराशि</label>
//                   <input
//                     type="number"
//                     value={newServiceCharge.amount}
//                     onChange={(e) => setNewServiceCharge({
//                       ...newServiceCharge,
//                       amount: parseFloat(e.target.value)
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">विलंब शुल्क</label>
//                   <input
//                     type="number"
//                     value={newServiceCharge.lateFee}
//                     onChange={(e) => setNewServiceCharge({
//                       ...newServiceCharge,
//                       lateFee: parseFloat(e.target.value)
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">दिनांक</label>
//                   <input
//                     type="date"
//                     value={newServiceCharge.date}
//                     onChange={(e) => setNewServiceCharge({
//                       ...newServiceCharge,
//                       date: e.target.value
//                     })}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleAddServiceCharge}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Add Service Charge
//               </button>
//             </div>

//             {serviceChargeHistory.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">वित्तीय वर्ष</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">सर्विस चार्ज धनराशि</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब शुल्क</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {serviceChargeHistory.map((charge, index) => (
//                       <tr key={index}>
//                         <td className="px-6 py-4 whitespace-nowrap">{charge.financialYear}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">₹{charge.amount}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">₹{charge.lateFee}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">{charge.date}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveServiceCharge(index)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py- 2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }