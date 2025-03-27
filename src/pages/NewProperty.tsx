import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import BASE_URL from "../data/endpoint";
// import ServiceChargeStep from "./ServiceChargeStep"; // Import the new component
import ServiceChargeStep from "../components/propertyCreation/serviceChargeStep";

// Form Structures
interface FormStep {
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "boolean" | "file";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
  accept?: string;
  maxSize?: number;
}

const baseFinancialYearOptions = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

const formSteps: FormStep[] = [
  {
    title: "Basic Information",
    fields: [
      { id: "yojna_id", label: "योजना का नाम", type: "select", options: [], required: true },
      { id: "avanti_ka_naam", label: "आवंटी का नाम", type: "text", required: true },
      { id: "pita_pati_ka_naam", label: "पिता/पति का नाम", type: "text", required: true },
      { id: "avanti_ka_sthayi_pata", label: "आवंटी का स्थायी पता", type: "textarea", required: true },
      { id: "avanti_ka_vartaman_pata", label: "आवंटी का वर्तमान पता", type: "textarea", required: true },
      { id: "mobile_no", label: "मोबाइल नंबर", type: "text", required: false },
      { id: "aadhar_number", label: "आधार नंबर", type: "text" },
      { id: "aadhar_photo", label: "आधार फोटो (max size 200kb)", type: "file", accept: "image/*", maxSize: 200 * 1024 },
      { id: "documents", label: "दस्तावेज़ (PDF only)", type: "file", accept: "application/pdf" },
    ],
  },
  {
    title: "Property Details",
    fields: [
      { id: "sampatti_sreni", label: "संपत्ति श्रेणी", type: "select", options: ["आवासीय", "वाणिज्यिक"], required: true },
      { id: "avanti_sampatti_sankhya", label: "संपत्ति संख्या", type: "text", required: true },
      { id: "property_floor_type", label: "फ्लोर प्रकार", type: "select", options: ["UGF", "LGF"], required: true },
      { id: "kshetrafal", label: "क्षेत्रफल (वर्ग मीटर)", type: "number" },
      { id: "kabja_dinank", label: "कब्जा दिनांक", type: "date" },
      { id: "bhavan_nirman", label: "भवन निर्माण", type: "boolean" },
    ],
  },
  {
    title: "Financial Information",
    fields: [
      { id: "panjikaran_dhanrashi", label: "पंजीकरण धनराशि", type: "number", required: true },
      { id: "panjikaran_dinank", label: "पंजीकरण दिनांक", type: "date", required: true },
      { id: "avantan_dhanrashi", label: "आवंटन धनराशि", type: "number", required: true },
      { id: "avantan_dinank", label: "आवंटन दिनांक", type: "date", required: true },
      { id: "vikray_mulya", label: "विक्रय शुल्क", type: "number", required: true },
      { id: "auction_keemat", label: "नीलामी कीमत", type: "number" },
      { id: "lease_rent_dhanrashi", label: "लीज रेंट धनराशि", type: "number" },
      { id: "free_hold_dhanrashi", label: "फ्री होल्ड धनराशि", type: "number" },
    ],
  },
  {
    title: "Installment Plan",
    fields: [
      { id: "interest_rate", label: "ब्याज दर (%)", type: "number", required: true, readOnly: true },
      { id: "time_period", label: "समय अवधि (वर्ष)", type: "number", required: true, readOnly: true },
      { id: "ideal_number_of_installments", label: "किश्तों की संख्या", type: "number", required: true, readOnly: true },
      { id: "start_date_of_installment_year", label: "किश्त शुरू होने की तारीख", type: "date", required: true },
      { id: "next_due_date", label: "अगली किश्त की तारीख", type: "date", required: true, readOnly: true },
    ],
  },
  {
    title: "Payment Installment Details",
    fields: [
      { id: "installment_amount", label: "किस्त जमा धनराशि", type: "number", required: true },
      { id: "interest_amount", label: "किस्त जमा ब्याज धनराशि", type: "number", required: true },
      { id: "late_fee", label: "विलंब ब्याज धनराशि", type: "number", required: true, readOnly: true },
      { id: "payment_date", label: "दिनांक", type: "date", required: true },
    ],
  },
  {
    title: "Additional Charges & Details",
    fields: [
      { id: "park_charge", label: "पार्क शुल्क", type: "number" },
      { id: "corner_charge", label: "कॉर्नर शुल्क", type: "number" },
      { id: "atirikt_bhoomi_ki_dhanrashi", label: "अतिरिक्त भूमि की धनराशि", type: "number" },
      { id: "punarjivit_shulk", label: "पुनर्जनन शुल्क", type: "number" },
      { id: "praman_patra_shulk", label: "प्रमाण पत्र शुल्क", type: "number" },
      { id: "vigyapan_shulk", label: "विज्ञापन शुल्क", type: "number" },
      { id: "nibandhan_shulk", label: "निबंधन शुल्क", type: "number" },
      { id: "nibandhan_dinank", label: "निबंधन दिनांक", type: "date" },
      { id: "labansh", label: "लाभांश", type: "text" },
      { id: "anya", label: "अन्य टिप्पणी", type: "textarea" },
    ],
  },
  {
    title: "Service Charge Details",
    fields: [
      { id: "service_charge_financial_year", label: "वित्तीय वर्ष", type: "select", options: [], required: true },
      { id: "service_charge_amount", label: "सेवा शुल्क राशि", type: "number", required: true, readOnly: true },
      { id: "service_charge_late_fee", label: "सेवा शुल्क विलंब शुल्क", type: "number", required: true, readOnly: true },
      { id: "service_charge_payment_date", label: "सेवा शुल्क भुगतान तिथि", type: "date", required: true },
    ],
  },
];

// Utility Functions
const formatIndianNumber = (num: number): string => {
  if (isNaN(num)) return "₹0.00";
  const numStr = num.toFixed(2);
  const [integer, decimal] = numStr.split(".");
  const lastThree = integer.slice(-3);
  const otherNumbers = integer.slice(0, -3);
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;
  return `₹${formattedInteger}.${decimal}`;
};

const calculateNextDueDate = (startDate: string): string => {
  if (!startDate) return "";
  const date = new Date(startDate);
  const nextDate = new Date(date.setMonth(date.getMonth() + 3));
  const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
  if (date.getDate() > lastDayOfMonth) nextDate.setDate(lastDayOfMonth);
  return nextDate.toISOString().split("T")[0];
};

const calculateLateFee = (dueDate: string, paymentDate: string, lfpd: number): number => {
  const due = new Date(dueDate);
  const payment = new Date(paymentDate);
  if (payment > due) {
    const daysDelayed = Math.ceil((payment.getTime() - due.getTime()) / (1000 * 3600 * 24));
    return daysDelayed * lfpd;
  }
  return 0;
};

const formatDateToDDMMYYYY = (dateString: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const validateAadhaarNumber = (value: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(value);
};

const validateMobileNumber = (value: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(value);
};

// Main Component
export default function CreateNewProperty() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({
    propertyRecord: {},
    installmentPlan: {},
    paymentInstallments: [],
    serviceCharges: [],
  });
  const [currentPaymentEntry, setCurrentPaymentEntry] = useState<any>({
    installment_amount: "",
    interest_amount: "",
    late_fee: "",
    payment_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const today = new Date().toISOString().split("T")[0];

  // Data Fetching
  useEffect(() => {
    const fetchYojnas = async () => {
      try {
        const response = await fetch(BASE_URL + "/api/yojnas");
        const data = await response.json();
        setYojnas(data.data);
      } catch (error) {
        console.error("Error fetching yojnas:", error);
      }
    };
    fetchYojnas();
  }, []);

  useEffect(() => {
    const selectedYojna = yojnas.find((y) => y.yojna_id === formData.propertyRecord.yojna_id);
    if (selectedYojna) {
      setFormData((prev: any) => ({
        ...prev,
        installmentPlan: {
          ...prev.installmentPlan,
          interest_rate: selectedYojna.interest_rate,
          time_period: selectedYojna.time_period,
          ideal_number_of_installments: selectedYojna.number_of_installments,
        },
      }));
    }
  }, [formData.propertyRecord.yojna_id, yojnas]);

  // Automatic Calculations
  useEffect(() => {
    const auctionKeemat = parseFloat(formData.propertyRecord.auction_keemat || "0");
    const panjikaranDhanrashi = parseFloat(formData.propertyRecord.panjikaran_dhanrashi || "0");
    const avantanDhanrashi = parseFloat(formData.propertyRecord.avantan_dhanrashi || "0");
    const calculatedAvshesh = auctionKeemat - (panjikaranDhanrashi + avantanDhanrashi);

    setFormData((prev: any) => ({
      ...prev,
      installmentPlan: {
        ...prev.installmentPlan,
        avshesh_dhanrashi: calculatedAvshesh > 0 ? calculatedAvshesh.toFixed(2) : "0.00",
      },
    }));
  }, [
    formData.propertyRecord.auction_keemat,
    formData.propertyRecord.panjikaran_dhanrashi,
    formData.propertyRecord.avantan_dhanrashi,
  ]);

  useEffect(() => {
    const startDate = formData.installmentPlan.start_date_of_installment_year;
    if (startDate) {
      const nextDueDate = calculateNextDueDate(startDate);
      setFormData((prev: any) => ({
        ...prev,
        installmentPlan: {
          ...prev.installmentPlan,
          next_due_date: nextDueDate,
        },
      }));
    }
  }, [formData.installmentPlan.start_date_of_installment_year]);

  useEffect(() => {
    if (currentStep === 4) {
      const paymentDate = currentPaymentEntry.payment_date;
      const dueDate = formData.installmentPlan.next_due_date;
      const avsheshDhanrashi = parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0");
      const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
      const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
      const idealNumberOfInstallments = parseInt(formData.installmentPlan.ideal_number_of_installments || "1");

      const totalInterestAmount = (avsheshDhanrashi * interestRate * timePeriod) / 100;
      const adjustedInterest = totalInterestAmount / 2;
      const kulYog = avsheshDhanrashi + adjustedInterest;
      const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
      const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

      if (paymentDate && dueDate) {
        const lateFee = calculateLateFee(dueDate, paymentDate, lateFeePerDay);
        setCurrentPaymentEntry((prev: any) => ({
          ...prev,
          late_fee: lateFee.toFixed(2),
        }));
      }
    }
  }, [currentPaymentEntry.payment_date, formData.installmentPlan.next_due_date, currentStep]);

  // Handlers
  const handleInputChange = (section: string, fieldId: string, value: any) => {
    if (section === "paymentInstallments") {
      setCurrentPaymentEntry((prev: any) => ({
        ...prev,
        [fieldId]: value === "" ? null : value,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [fieldId]: value === "" ? null : value,
        },
      }));
    }

    // if (fieldId === "aadhar_number") {
    //   if (!validateAadhaarNumber(value)) {
    //     setErrors((prev) => ({
    //       ...prev,
    //       aadhar_number: "Aadhaar number must be exactly 12 digits",
    //     }));
    //   } else {
    //     setErrors((prev) => {
    //       const newErrors = { ...prev };
    //       delete newErrors.aadhar_number;
    //       return newErrors;
    //     });
    //   }
    // }

    // if (fieldId === "mobile_no") {
    //   if (!validateMobileNumber(value)) {
    //     setErrors((prev) => ({
    //       ...prev,
    //       mobile_no: "Mobile number must be exactly 10 digits",
    //     }));
    //   } else {
    //     setErrors((prev) => {
    //       const newErrors = { ...prev };
    //       delete newErrors.mobile_no;
    //       return newErrors;
    //     });
    //   }
    // }

    if (fieldId === "aadhar_photo" && value) {
      const file = value as File;
      const maxSize = 200 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          aadhar_photo: "File size must not exceed 200KB",
        }));
        setFormData((prev: any) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [fieldId]: null,
          },
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.aadhar_photo;
          return newErrors;
        });
      }
    }
  };

  const handleAddPayment = () => {
    const { installment_amount, interest_amount, payment_date } = currentPaymentEntry;
    if (!installment_amount || !interest_amount || !payment_date) {
      alert("Please fill in all required fields before adding a payment.");
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      paymentInstallments: [...prev.paymentInstallments, { ...currentPaymentEntry }],
    }));

    setCurrentPaymentEntry({
      installment_amount: "",
      interest_amount: "",
      late_fee: "",
      payment_date: "",
    });
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // const aadhaarValid = validateAadhaarNumber(formData.propertyRecord.aadhar_number || "");
      // const mobileValid = validateMobileNumber(formData.propertyRecord.mobile_no || "");

      // if (!aadhaarValid) setErrors((prev) => ({ ...prev, aadhar_number: "Aadhaar number must be exactly 12 digits" }));
      // if (!mobileValid) setErrors((prev) => ({ ...prev, mobile_no: "Mobile number must be exactly 10 digits" }));

      // if (!aadhaarValid || !mobileValid) return;
    }

    setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
  };

  const handlePrevious = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 6) return;

    const confirmSubmission = window.confirm("Are you sure you want to submit the property details?");
    if (!confirmSubmission) return;

    setIsSubmitting(true);

    const avsheshDhanrashi = parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0");
    const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
    const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
    const idealNumberOfInstallments = parseInt(formData.installmentPlan.ideal_number_of_installments || "1");

    const totalInterestAmount = (avsheshDhanrashi * interestRate * timePeriod) / 100;
    const adjustedInterest = totalInterestAmount / 2;
    const kulYog = avsheshDhanrashi + adjustedInterest;
    const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
    const idealKishtMool = avsheshDhanrashi / idealNumberOfInstallments;
    const idealKishtByaj = adjustedInterest / idealNumberOfInstallments;
    const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

    const payload = {
      propertyRecord: {
        ...formData.propertyRecord,
        bhavan_nirman: formData.propertyRecord.bhavan_nirman === "true" ? "Yes" : "No",
        panjikaran_dinank: formatDateToDDMMYYYY(formData.propertyRecord.panjikaran_dinank),
        avantan_dinank: formatDateToDDMMYYYY(formData.propertyRecord.avantan_dinank),
        kabja_dinank: formatDateToDDMMYYYY(formData.propertyRecord.kabja_dinank),
        nibandhan_dinank: formatDateToDDMMYYYY(formData.propertyRecord.nibandhan_dinank),
      },
      installmentPlan: {
        avshesh_dhanrashi: avsheshDhanrashi,
        interest_rate: interestRate,
        time_period: timePeriod,
        total_interest_amount: totalInterestAmount,
        total_interest_amount_div_2: adjustedInterest,
        kul_yog: kulYog,
        remaining_balance: kulYog,
        ideal_number_of_installments: idealNumberOfInstallments,
        ideal_installment_amount_per_installment: idealInstallmentAmount,
        ideal_kisht_mool: idealKishtMool,
        ideal_kisht_byaj: idealKishtByaj,
        late_fee_per_day: lateFeePerDay,
        start_date_of_installment_year: formatDateToDDMMYYYY(formData.installmentPlan.start_date_of_installment_year),
        next_due_date: formatDateToDDMMYYYY(formData.installmentPlan.next_due_date),
      },
      paymentInstallments: formData.paymentInstallments.map((payment: any) => ({
        ...payment,
        payment_date: formatDateToDDMMYYYY(payment.payment_date),
        payment_due_date: formatDateToDDMMYYYY(formData.installmentPlan.next_due_date),
        payment_amount: parseFloat(payment.installment_amount || "0") + parseFloat(payment.interest_amount || "0"),
        kisht_mool_paid: parseFloat(payment.installment_amount || "0"),
        kisht_byaj_paid: parseFloat(payment.interest_amount || "0"),
        total_payment_amount_with_late_fee:
          parseFloat(payment.installment_amount || "0") +
          parseFloat(payment.interest_amount || "0") +
          parseFloat(payment.late_fee || "0"),
        number_of_days_delayed:
          payment.payment_date && formData.installmentPlan.next_due_date
            ? Math.ceil(
                (new Date(payment.payment_date).getTime() -
                  new Date(formData.installmentPlan.next_due_date).getTime()) /
                  (1000 * 3600 * 24)
              )
            : 0,
        late_fee_amount: parseFloat(payment.late_fee || "0"),
      })),
      serviceCharges: formData.serviceCharges.map((charge: any) => ({
        service_charge_financial_year: charge.service_charge_financial_year,
        service_charge_amount: charge.service_charge_amount,
        service_charge_late_fee: charge.service_charge_late_fee,
        service_charge_total: (charge.service_charge_amount || 0) + (charge.service_charge_late_fee || 0),
        service_charge_payment_date: formatDateToDDMMYYYY(charge.service_charge_payment_date),
      })),
    };

    console.log(payload);

    setIsSubmitting(false);
  };

  // Step -> State Section Mapping
  const sectionMap: { [key: number]: string } = {
    0: "propertyRecord",
    1: "propertyRecord",
    2: "propertyRecord",
    3: "installmentPlan",
    4: "paymentInstallments",
    5: "propertyRecord",
    6: "serviceCharges",
  };

  // Rendering
  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Property</h2>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-8">
            {formSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white",
                    currentStep === index ? "bg-blue-600" : "bg-gray-400"
                  )}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{step.title}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto px-2 custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                  {formSteps[currentStep].title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Fill in the details for {formSteps[currentStep].title.toLowerCase()}.
                </p>
              </div>

              {currentStep === 6 ? (
                <ServiceChargeStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {formSteps[currentStep].fields.map((field) => {
                    let fieldValue: any = "";
                    if (sectionMap[currentStep] === "paymentInstallments") {
                      fieldValue = currentPaymentEntry[field.id] || "";
                    } else {
                      fieldValue = formData[sectionMap[currentStep]][field.id] || "";
                    }

                    return (
                      <div key={field.id} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
                        </label>
                        {field.readOnly ? (
                          <input
                            type={field.type}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 cursor-not-allowed"
                            value={fieldValue}
                            disabled
                          />
                        ) : field.type === "select" ? (
                          <select
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                            value={fieldValue}
                          >
                            <option value="" className="dark:bg-gray-800">Select option...</option>
                            {field.id === "yojna_id"
                              ? yojnas.map((yojna) => (
                                  <option key={yojna.yojna_id} value={yojna.yojna_id} className="dark:bg-gray-800">
                                    {yojna.yojna_name}
                                  </option>
                                ))
                              : field.options?.map((option) => (
                                  <option key={option} value={option} className="dark:bg-gray-800">
                                    {option}
                                  </option>
                                ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm min-h-24"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                          />
                        ) : field.type === "boolean" ? (
                          <select
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                            value={fieldValue}
                          >
                            <option value="" className="dark:bg-gray-800">Select...</option>
                            <option value="true" className="dark:bg-gray-800">Yes</option>
                            <option value="false" className="dark:bg-gray-800">No</option>
                          </select>
                        ) : field.type === "file" ? (
                          <input
                            type="file"
                            accept={field.accept}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            onChange={(e) =>
                              handleInputChange(sectionMap[currentStep], field.id, e.target.files ? e.target.files[0] : null)
                            }
                          />
                        ) : field.type === "date" ? (
                          <input
                            type="date"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            value={fieldValue}
                            max={today}
                            onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                          />
                        ) : (
                          <input
                            type={field.type}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                          />
                        )}
                        {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
                      </div>
                    );
                  })}
                </div>
              )}

              {currentStep === 4 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 font-medium transition-colors flex items-center shadow-sm"
                  >
                    Add Payment
                  </button>

                  {formData.paymentInstallments.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Installment Amount</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Interest Amount</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Late Fee</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Payment Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Total Payment Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.paymentInstallments.map((payment: any, index: number) => {
                            const totalPaymentAmount =
                              parseFloat(payment.installment_amount || "0") +
                              parseFloat(payment.interest_amount || "0") +
                              parseFloat(payment.late_fee || "0");
                            return (
                              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                  {formatIndianNumber(parseFloat(payment.installment_amount || "0"))}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                  {formatIndianNumber(parseFloat(payment.interest_amount || "0"))}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                  {formatIndianNumber(parseFloat(payment.late_fee || "0"))}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                  {formatDateToDDMMYYYY(payment.payment_date) || payment.payment_date}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                  {formatIndianNumber(totalPaymentAmount)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Installment Plan Summary</h4>
                  {(() => {
                    const avsheshDhanrashi = parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0");
                    const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
                    const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
                    const idealNumberOfInstallments = parseInt(formData.installmentPlan.ideal_number_of_installments || "1");

                    const totalInterestAmount = (avsheshDhanrashi * interestRate * timePeriod) / 100;
                    const adjustedInterest = totalInterestAmount / 2;
                    const kulYog = avsheshDhanrashi + adjustedInterest;
                    const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
                    const idealKishtMool = avsheshDhanrashi / idealNumberOfInstallments;
                    const idealKishtByaj = adjustedInterest / idealNumberOfInstallments;
                    const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">अवशेष धनराशि</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(avsheshDhanrashi)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">कुल ब्याज राशि (एक वर्ष)</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(totalInterestAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ब्याज राशि (छह महीने)
                            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(adjustedInterest)}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">कुल योग</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(kulYog)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">तिमहि किस्त धनराशी</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(idealInstallmentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">किस्त मूल धनराशी</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(idealKishtMool)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">किस्त ब्याज धनराशी</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(idealKishtByaj)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">प्रति दिन विलंब धनराशी</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatIndianNumber(lateFeePerDay)}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {currentStep < formSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-medium transition-colors flex items-center shadow-sm"
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}