import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn"; // Utility for combining classNames
import { DashboardLayout } from "../components/layout/DashboardLayout";
import BASE_URL from "../data/endpoint";

//
// ----------------------------- Form Structures -----------------------------
//

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

// The same 7 steps as before
const formSteps: FormStep[] = [
  {
    title: "Basic Information",
    fields: [
      {
        id: "yojna_id",
        label: "योजना का नाम",
        type: "select",
        options: [],
        required: true,
      },
      {
        id: "avanti_ka_naam",
        label: "आवंटी का नाम",
        type: "text",
        required: true,
      },
      {
        id: "pita_pati_ka_naam",
        label: "पिता/पति का नाम",
        type: "text",
        required: true,
      },
      {
        id: "avanti_ka_sthayi_pata",
        label: "आवंटी का स्थायी पता",
        type: "textarea",
        required: true,
      },
      {
        id: "avanti_ka_vartaman_pata",
        label: "आवंटी का वर्तमान पता",
        type: "textarea",
        required: true,
      },
      {
        id: "mobile_no",
        label: "मोबाइल नंबर",
        type: "text",
        required: true,
      },
      {
        id: "aadhar_number",
        label: "आधार नंबर",
        type: "text",
      },
      {
        id: "aadhar_photo",
        label: "आधार फोटो (max size 200kb)",
        type: "file",
        accept: "image/*",
        maxSize: 200 * 1024,
      },
      {
        id: "documents",
        label: "दस्तावेज़ (PDF only)",
        type: "file",
        accept: "application/pdf",
      },
    ],
  },
  {
    title: "Property Details",
    fields: [
      {
        id: "sampatti_sreni",
        label: "संपत्ति श्रेणी",
        type: "select",
        options: ["आवासीय", "वाणिज्यिक"],
        required: true,
      },
      {
        id: "avanti_sampatti_sankhya",
        label: "संपत्ति संख्या",
        type: "text",
        required: true,
      },
      {
        id: "property_floor_type",
        label: "फ्लोर प्रकार",
        type: "select",
        options: ["UGF", "LGF"],
        required: true,
      },
      { id: "kshetrafal", label: "क्षेत्रफल (वर्ग मीटर)", type: "number" },
      { id: "kabja_dinank", label: "कब्जा दिनांक", type: "date" },
      { id: "bhavan_nirman", label: "भवन निर्माण", type: "boolean" },
    ],
  },
  {
    title: "Financial Information",
    fields: [
      {
        id: "panjikaran_dhanrashi",
        label: "पंजीकरण धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "panjikaran_dinank",
        label: "पंजीकरण दिनांक",
        type: "date",
        required: true,
      },
      {
        id: "avantan_dhanrashi",
        label: "आवंटन धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "avantan_dinank",
        label: "आवंटन दिनांक",
        type: "date",
        required: true,
      },
      {
        id: "vikray_mulya",
        label: "विक्रय शुल्क",
        type: "number",
        required: true,
      },
      { id: "auction_keemat", label: "नीलामी कीमत", type: "number" },
      { id: "lease_rent_dhanrashi", label: "लीज रेंट धनराशि", type: "number" },
      { id: "free_hold_dhanrashi", label: "फ्री होल्ड धनराशि", type: "number" },
    ],
  },
  {
    title: "Installment Plan",
    fields: [
      {
        id: "interest_rate",
        label: "ब्याज दर (%)",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "time_period",
        label: "समय अवधि (वर्ष)",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "ideal_number_of_installments",
        label: "किश्तों की संख्या",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "start_date_of_installment_year",
        label: "किश्त शुरू होने की तारीख",
        type: "date",
        required: true,
      },
      {
        id: "next_due_date",
        label: "अगली किश्त की तारीख",
        type: "date",
        required: true,
        readOnly: true,
      },
    ],
  },
  {
    title: "Payment Installment Details",
    fields: [
      {
        id: "installment_amount",
        label: "किस्त जमा धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "interest_amount",
        label: "किस्त जमा ब्याज धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "late_fee",
        label: "विलंब ब्याज धनराशि",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "payment_date",
        label: "दिनांक",
        type: "date",
        required: true,
      },
    ],
  },
  {
    title: "Additional Charges & Details",
    fields: [
      { id: "park_charge", label: "पार्क शुल्क", type: "number" },
      { id: "corner_charge", label: "कॉर्नर शुल्क", type: "number" },
      {
        id: "atirikt_bhoomi_ki_dhanrashi",
        label: "अतिरिक्त भूमि की धनराशि",
        type: "number",
      },
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
      // We'll only show "financial year" + "payment date" in the form. 
      // The rest are read-only or automatically computed.
      {
        id: "service_charge_financial_year",
        label: "वित्तीय वर्ष",
        type: "select",
        options: [], // we fill it dynamically
        required: true,
      },
      {
        id: "service_charge_payment_date",
        label: "सेवा शुल्क भुगतान तिथि",
        type: "date",
        required: true,
      },
      // We'll not show "service_charge_amount" or "service_charge_late_fee" as inputs
      // They are computed once the user selects the year & date, then "Add Service Charge"
    ],
  },
];

//
// ----------------------------- Utility Functions -----------------------------
//

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
  const lastDayOfMonth = new Date(
    nextDate.getFullYear(),
    nextDate.getMonth() + 1,
    0
  ).getDate();
  if (date.getDate() > lastDayOfMonth) {
    nextDate.setDate(lastDayOfMonth);
  }
  return nextDate.toISOString().split("T")[0];
};

const calculateLateFee = (dueDate: string, paymentDate: string, lfpd: number): number => {
  const due = new Date(dueDate);
  const payment = new Date(paymentDate);
  if (payment > due) {
    const daysDelayed = Math.ceil(
      (payment.getTime() - due.getTime()) / (1000 * 3600 * 24)
    );
    return daysDelayed * lfpd;
  }
  return 0;
};

// 1 Apr - 31 Mar approach
const getFinancialYearFromDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();
  return month < 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
};

const generateFinancialYearOptions = (allotmentDate: string): string[] => {
  const allotmentFY = getFinancialYearFromDate(allotmentDate);
  // skip the allotment year => start from allotmentFY+1
  const [startY1, startY2] = allotmentFY.split("-").map(Number);
  const nextStart = startY2; // the second year in "2015-2016" is 2016

  const options: string[] = [];
  for (let year = nextStart; year <= 2025; year++) {
    options.push(`${year}-${year + 1}`);
  }
  return options;
};

// Overdue logic: 1 year => 5%, 2 => 10%, 3+ => 15%
function computeServiceChargeLateFee(
  propertyFloorType: string,
  selectedFY: string,
  allotmentFY: string,
  paymentDate: string
): { base: number; lateFee: number } {
  if (!propertyFloorType || !selectedFY || !allotmentFY || !paymentDate) {
    return { base: 0, lateFee: 0 };
  }

  // base
  const baseCharge = propertyFloorType === "LGF" ? 10610 : 11005;

  // compute how many years late
  const [fyStart, fyEnd] = selectedFY.split("-").map(Number); // e.g. 2021-2022 => [2021,2022]
  // The year ends 31-Mar-fyEnd
  const yearEnd = fyEnd; 
  const payDateObj = new Date(paymentDate);
  // We'll treat 31-Mar-yearEnd as the due date
  const dueDate = new Date(`${yearEnd}-03-31`);
  if (payDateObj <= dueDate) {
    return { base: baseCharge, lateFee: 0 };
  }

  // difference
  const overdue = payDateObj.getFullYear() - yearEnd;
  // if overdue >= 1 => 5%, >=2 => 10%, >=3 => 15%
  let latePercent = 0;
  if (overdue >= 3) latePercent = 0.15;
  else if (overdue === 2) latePercent = 0.1;
  else if (overdue === 1) latePercent = 0.05;

  return {
    base: baseCharge,
    lateFee: baseCharge * latePercent,
  };
}

// format dd-mm-yyyy
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

//
// ----------------------------- Main Component -----------------------------
//
export default function CreateNewProperty() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [formData, setFormData] = useState<any>({
    propertyRecord: {},
    installmentPlan: {},
    paymentInstallments: [],
    serviceCharges: [],
  });

  // For Step 4 payment installments
  const [currentPaymentEntry, setCurrentPaymentEntry] = useState<any>({
    installment_amount: "",
    interest_amount: "",
    late_fee: "",
    payment_date: "",
  });

  // For Step 6 service charges (we want multi entries as well)
  const [currentServiceChargeEntry, setCurrentServiceChargeEntry] =
    useState<any>({
      service_charge_financial_year: "",
      service_charge_payment_date: "",
    });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [financialYearOptions, setFinancialYearOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const today = new Date().toISOString().split("T")[0];

  //
  // ----------------------------- Data Fetching -----------------------------
  //
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

  // If user picks a Yojna, auto-fill interest rate, time period, etc.
  useEffect(() => {
    const selectedYojna = yojnas.find(
      (y) => y.yojna_id === formData.propertyRecord.yojna_id
    );
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

  //
  // ----------------------------- Automatic Calculations -----------------------------
  //

  // Compute avshesh => installmentPlan.avshesh_dhanrashi
  useEffect(() => {
    const auctionKeemat = parseFloat(
      formData.propertyRecord.auction_keemat || "0"
    );
    const panjikaranDhanrashi = parseFloat(
      formData.propertyRecord.panjikaran_dhanrashi || "0"
    );
    const avantanDhanrashi = parseFloat(
      formData.propertyRecord.avantan_dhanrashi || "0"
    );
    const calculatedAvshesh =
      auctionKeemat - (panjikaranDhanrashi + avantanDhanrashi);

    setFormData((prev: any) => ({
      ...prev,
      installmentPlan: {
        ...prev.installmentPlan,
        avshesh_dhanrashi:
          calculatedAvshesh > 0 ? calculatedAvshesh.toFixed(2) : "0.00",
      },
    }));
  }, [
    formData.propertyRecord.auction_keemat,
    formData.propertyRecord.panjikaran_dhanrashi,
    formData.propertyRecord.avantan_dhanrashi,
  ]);

  // Recompute next_due_date if start_date_of_installment_year changes
  useEffect(() => {
    const startDate = formData.installmentPlan.start_date_of_installment_year;
    if (startDate) {
      const nd = calculateNextDueDate(startDate);
      setFormData((prev: any) => ({
        ...prev,
        installmentPlan: {
          ...prev.installmentPlan,
          next_due_date: nd,
        },
      }));
    }
  }, [formData.installmentPlan.start_date_of_installment_year]);

  // Step 4: PaymentInstallment "late fee" calculation
  useEffect(() => {
    if (currentStep === 4) {
      const paymentDate = currentPaymentEntry.payment_date;
      const dueDate = formData.installmentPlan.next_due_date;
      const avsheshDhanrashi = parseFloat(
        formData.installmentPlan.avshesh_dhanrashi || "0"
      );
      const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
      const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
      const idealNumberOfInstallments = parseInt(
        formData.installmentPlan.ideal_number_of_installments || "1"
      );

      const totalInterestAmount = (avsheshDhanrashi * interestRate * timePeriod) / 100;
      const adjustedInterest = totalInterestAmount / 2;
      const kulYog = avsheshDhanrashi + adjustedInterest;
      const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
      const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

      if (paymentDate && dueDate) {
        const lf = calculateLateFee(dueDate, paymentDate, lateFeePerDay);
        setCurrentPaymentEntry((prev: any) => ({
          ...prev,
          late_fee: lf.toFixed(2),
        }));
      }
    }
  }, [currentPaymentEntry.payment_date, formData.installmentPlan.next_due_date, currentStep]);

  // Build financial year options from allotment date
  useEffect(() => {
    const allotmentDate = formData.propertyRecord.avantan_dinank;
    if (allotmentDate) {
      // skip the allotment year -> start from next
      const options = generateFinancialYearOptions(allotmentDate);
      setFinancialYearOptions(options);
    }
  }, [formData.propertyRecord.avantan_dinank]);

  // We'll remove the old Step 6 logic that forced single service charge record
  // Instead, we handle multi entries via "Add Service Charge" button

  //
  // ----------------------------- Payment & Service Charge Add Buttons -----------------------------
  //

  // Step 4: "Add Payment"
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
    // reset
    setCurrentPaymentEntry({
      installment_amount: "",
      interest_amount: "",
      late_fee: "",
      payment_date: "",
    });
  };

  // Step 6: "Add Service Charge"
  const [currentServiceChargeComputed, setCurrentServiceChargeComputed] = useState<{
    base: number;
    lateFee: number;
  }>({ base: 0, lateFee: 0 });

  useEffect(() => {
    if (currentStep === 6) {
      const floorType = formData.propertyRecord.property_floor_type || "UGF";
      const allotmentDate = formData.propertyRecord.avantan_dinank || "";
      const allotmentFY = getFinancialYearFromDate(allotmentDate);

      const selectedFY = currentServiceChargeEntry.service_charge_financial_year;
      const payDate = currentServiceChargeEntry.service_charge_payment_date;

      const { base, lateFee } = computeServiceChargeLateFee(
        floorType,
        selectedFY,
        allotmentFY,
        payDate
      );
      setCurrentServiceChargeComputed({ base, lateFee });
    }
  }, [currentStep, currentServiceChargeEntry, formData.propertyRecord.property_floor_type]);

  // Add a row to formData.serviceCharges
  const handleAddServiceCharge = () => {
    const { service_charge_financial_year, service_charge_payment_date } = currentServiceChargeEntry;
    if (!service_charge_financial_year || !service_charge_payment_date) {
      alert("Please select financial year and payment date first.");
      return;
    }

    // compute final
    const base = currentServiceChargeComputed.base;
    const lf = currentServiceChargeComputed.lateFee;
    const total = base + lf;

    const newEntry = {
      service_charge_financial_year,
      service_charge_amount: base.toFixed(2),
      service_charge_late_fee: lf.toFixed(2),
      service_charge_total: total.toFixed(2),
      service_charge_payment_date,
    };

    setFormData((prev: any) => ({
      ...prev,
      serviceCharges: [...prev.serviceCharges, newEntry],
    }));

    // reset
    setCurrentServiceChargeEntry({
      service_charge_financial_year: "",
      service_charge_payment_date: "",
    });
    setCurrentServiceChargeComputed({ base: 0, lateFee: 0 });
  };

  //
  // ----------------------------- Next/Prev/Submit -----------------------------
  //

  const handleNext = () => {
    // Basic validations on Step 0
    if (currentStep === 0) {
      const aadhaarValid = validateAadhaarNumber(formData.propertyRecord.aadhar_number || "");
      const mobileValid = validateMobileNumber(formData.propertyRecord.mobile_no || "");

      if (!aadhaarValid) {
        setErrors((prev) => ({
          ...prev,
          aadhar_number: "Aadhaar number must be exactly 12 digits",
        }));
      }
      if (!mobileValid) {
        setErrors((prev) => ({
          ...prev,
          mobile_no: "Mobile number must be exactly 10 digits",
        }));
      }
      if (!aadhaarValid || !mobileValid) {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // only on step 6
    if (currentStep !== 6) return;

    const confirmSubmission = window.confirm(
      "Are you sure you want to submit the property details?"
    );
    if (!confirmSubmission) return;

    setIsSubmitting(true);

    try {
      // Calculate final installmentPlan fields
      const avsheshDhanrashi = parseFloat(
        formData.installmentPlan.avshesh_dhanrashi || "0"
      );
      const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
      const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
      const idealNumberOfInstallments = parseInt(
        formData.installmentPlan.ideal_number_of_installments || "1"
      );

      const totalInterestAmount =
        (avsheshDhanrashi * interestRate * timePeriod) / 100;
      const adjustedInterest = totalInterestAmount / 2;
      const kulYog = avsheshDhanrashi + adjustedInterest;
      const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
      const idealKishtMool = avsheshDhanrashi / idealNumberOfInstallments;
      const idealKishtByaj = adjustedInterest / idealNumberOfInstallments;
      const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

      // Build final payload
      const payload = {
        propertyRecord: {
          ...formData.propertyRecord,
          bhavan_nirman:
            formData.propertyRecord.bhavan_nirman === "true" ? "Yes" : "No",
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
          start_date_of_installment_year: formatDateToDDMMYYYY(
            formData.installmentPlan.start_date_of_installment_year
          ),
          next_due_date: formatDateToDDMMYYYY(
            formData.installmentPlan.next_due_date
          ),
        },
        paymentInstallments: formData.paymentInstallments.map((payment: any) => {
          const finalPaymentDate = formatDateToDDMMYYYY(payment.payment_date);
          const finalDueDate = formatDateToDDMMYYYY(
            formData.installmentPlan.next_due_date
          );
          const pm = parseFloat(payment.installment_amount || "0");
          const im = parseFloat(payment.interest_amount || "0");
          const lf = parseFloat(payment.late_fee || "0");
          const totalPay = pm + im;
          const totalWithLate = totalPay + lf;
          const daysDelayed =
            payment.payment_date && formData.installmentPlan.next_due_date
              ? Math.ceil(
                  (new Date(payment.payment_date).getTime() -
                    new Date(formData.installmentPlan.next_due_date).getTime()) /
                    (1000 * 3600 * 24)
                )
              : 0;

          return {
            ...payment,
            payment_date: finalPaymentDate,
            payment_due_date: finalDueDate,
            payment_amount: totalPay,
            kisht_mool_paid: pm,
            kisht_byaj_paid: im,
            total_payment_amount_with_late_fee: totalWithLate,
            number_of_days_delayed: daysDelayed,
            late_fee_amount: lf,
          };
        }),
        serviceCharges: formData.serviceCharges.map((charge: any) => {
          return {
            service_charge_financial_year: charge.service_charge_financial_year,
            service_charge_amount: parseFloat(charge.service_charge_amount || "0"),
            service_charge_late_fee: parseFloat(charge.service_charge_late_fee || "0"),
            service_charge_total:
              parseFloat(charge.service_charge_amount || "0") +
              parseFloat(charge.service_charge_late_fee || "0"),
            service_charge_payment_date: formatDateToDDMMYYYY(
              charge.service_charge_payment_date
            ),
          };
        }),
      };

      // console.log("Final Payload:", payload);
      console.log(payload)

      // TODO: Actually POST to /api/properties (uncomment for real usage)
      // const token = localStorage.getItem("bida_token");
      // const res = await fetch(BASE_URL + "/api/properties", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("Property creation failed");
      // const responseData = await res.json();
      // console.log("Created property:", responseData);

      alert("Property data logged in console. (Submit final in real usage)");
    } catch (err) {
      console.error(err);
      alert("Error: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step -> State Section
  const sectionMap: { [key: number]: string } = {
    0: "propertyRecord",
    1: "propertyRecord",
    2: "propertyRecord",
    3: "installmentPlan",
    4: "paymentInstallments",
    5: "propertyRecord",
    6: "serviceCharges",
  };

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Property
            </h2>
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
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {step.title}
                </p>
              </div>
            ))}
          </div>

          {/* Form Container */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {/* Render each field */}
                {formSteps[currentStep].fields.map((field) => {
                  let fieldValue: any = "";
                  if (sectionMap[currentStep] === "paymentInstallments") {
                    // Step 4 => Payment
                    fieldValue = currentPaymentEntry[field.id] || "";
                  } else if (sectionMap[currentStep] === "serviceCharges") {
                    // Step 6 => We'll only show "financial_year" + "payment_date" for the current new entry
                    if (field.id === "service_charge_financial_year") {
                      fieldValue = currentServiceChargeEntry[field.id] || "";
                    } else if (field.id === "service_charge_payment_date") {
                      fieldValue = currentServiceChargeEntry[field.id] || "";
                    } else {
                      // readOnly fields won't be displayed here
                      fieldValue = "";
                    }
                  } else {
                    // Normal approach
                    fieldValue = formData[sectionMap[currentStep]][field.id] || "";
                  }

                  return (
                    <div key={field.id} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 dark:text-red-400 ml-1">
                            *
                          </span>
                        )}
                      </label>

                      {/* Handling readOnly, select, etc. */}
                      {field.readOnly ? (
                        <input
                          type={field.type}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 cursor-not-allowed"
                          value={fieldValue}
                          disabled
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-400"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (sectionMap[currentStep] === "serviceCharges") {
                              // Step 6
                              setCurrentServiceChargeEntry((prev: any) => ({
                                ...prev,
                                [field.id]: val,
                              }));
                            } else {
                              // normal approach
                              handleInputChange(sectionMap[currentStep], field.id, val);
                            }
                          }}
                          value={fieldValue}
                        >
                          <option value="">Select option...</option>
                          {field.id === "yojna_id"
                            ? yojnas.map((yojna) => (
                                <option key={yojna.yojna_id} value={yojna.yojna_id}>
                                  {yojna.yojna_name}
                                </option>
                              ))
                            : field.id === "service_charge_financial_year"
                            ? financialYearOptions.map((fy) => (
                                <option key={fy} value={fy}>
                                  {fy}
                                </option>
                              ))
                            : field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          className="w-full px-3 py-2 rounded-lg border border-gray-300"
                          value={fieldValue}
                          onChange={(e) =>
                            handleInputChange(
                              sectionMap[currentStep],
                              field.id,
                              e.target.value
                            )
                          }
                        />
                      ) : field.type === "boolean" ? (
                        <select
                          className="w-full px-3 py-2 rounded-lg border border-gray-300"
                          onChange={(e) =>
                            handleInputChange(sectionMap[currentStep], field.id, e.target.value)
                          }
                          value={fieldValue}
                        >
                          <option value="">Select...</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : field.type === "file" ? (
                        <input
                          type="file"
                          accept={field.accept}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300"
                          onChange={(e) =>
                            handleInputChange(
                              sectionMap[currentStep],
                              field.id,
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                        />
                      ) : field.type === "date" ? (
                        <input
                          type="date"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300"
                          value={fieldValue}
                          max={today}
                          onChange={(e) =>
                            sectionMap[currentStep] === "serviceCharges"
                              ? setCurrentServiceChargeEntry((prev: any) => ({
                                  ...prev,
                                  [field.id]: e.target.value,
                                }))
                              : handleInputChange(
                                  sectionMap[currentStep],
                                  field.id,
                                  e.target.value
                                )
                          }
                        />
                      ) : (
                        // normal text/number input
                        <input
                          type={field.type}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300"
                          value={fieldValue}
                          onChange={(e) =>
                            sectionMap[currentStep] === "serviceCharges"
                              ? setCurrentServiceChargeEntry((prev: any) => ({
                                  ...prev,
                                  [field.id]: e.target.value,
                                }))
                              : handleInputChange(
                                  sectionMap[currentStep],
                                  field.id,
                                  e.target.value
                                )
                          }
                        />
                      )}

                      {/* Error */}
                      {errors[field.id] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[field.id]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Payment Table & Button for Step 4 */}
              {currentStep === 4 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
                  >
                    Add Payment
                  </button>

                  {/* Payment Table */}
                  {formData.paymentInstallments.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              Installment Amount
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              Interest Amount
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              Late Fee
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              Payment Date
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              Total Payment Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.paymentInstallments.map(
                            (payment: any, index: number) => {
                              const totalPaymentAmount =
                                parseFloat(payment.installment_amount || "0") +
                                parseFloat(payment.interest_amount || "0") +
                                parseFloat(payment.late_fee || "0");
                              return (
                                <tr
                                  key={index}
                                  className="border-t border-gray-200"
                                >
                                  <td className="px-4 py-2 text-sm">
                                    {formatIndianNumber(
                                      parseFloat(payment.installment_amount || "0")
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    {formatIndianNumber(
                                      parseFloat(payment.interest_amount || "0")
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    {formatIndianNumber(
                                      parseFloat(payment.late_fee || "0")
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    {formatDateToDDMMYYYY(payment.payment_date) || payment.payment_date}
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    {formatIndianNumber(totalPaymentAmount)}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Installment Plan Summary (Step 3) */}
              {currentStep === 3 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium mb-4">
                    Installment Plan Summary
                  </h4>
                  {(() => {
                    const avsheshDhanrashi = parseFloat(
                      formData.installmentPlan.avshesh_dhanrashi || "0"
                    );
                    const interestRate = parseFloat(
                      formData.installmentPlan.interest_rate || "0"
                    );
                    const timePeriod = parseFloat(
                      formData.installmentPlan.time_period || "0"
                    );
                    const idealNumberOfInstallments = parseInt(
                      formData.installmentPlan.ideal_number_of_installments || "1"
                    );

                    const totalInterestAmount =
                      (avsheshDhanrashi * interestRate * timePeriod) / 100;
                    const adjustedInterest = totalInterestAmount / 2;
                    const kulYog = avsheshDhanrashi + adjustedInterest;
                    const idealInstallmentAmount =
                      kulYog / idealNumberOfInstallments;
                    const idealKishtMool =
                      avsheshDhanrashi / idealNumberOfInstallments;
                    const idealKishtByaj =
                      adjustedInterest / idealNumberOfInstallments;
                    const lateFeePerDay =
                      (0.18 * idealInstallmentAmount) / 365;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">अवशेष धनराशि</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(avsheshDhanrashi)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">कुल ब्याज राशि (एक वर्ष)</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(totalInterestAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ब्याज राशि (छह महीने)</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(adjustedInterest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">कुल योग</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(kulYog)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">तिमहि किस्त धनराशी</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(idealInstallmentAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">किस्त मूल धनराशी</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(idealKishtMool)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">किस्त ब्याज धनराशी</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(idealKishtByaj)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">प्रति दिन विलंब धनराशी</p>
                          <p className="text-lg font-semibold">
                            {formatIndianNumber(lateFeePerDay)}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Step 6: Service Charge multi-entry */}
              {currentStep === 6 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-4">Service Charges</h4>
                  {/* Fields: financial year + payment date => we compute base + late fee */}
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        वित्तीय वर्ष
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-300"
                        value={currentServiceChargeEntry.service_charge_financial_year}
                        onChange={(e) =>
                          setCurrentServiceChargeEntry((prev: any) => ({
                            ...prev,
                            service_charge_financial_year: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select FY</option>
                        {financialYearOptions.map((fy) => (
                          <option key={fy} value={fy}>
                            {fy}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        सेवा शुल्क भुगतान तिथि
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300"
                        value={currentServiceChargeEntry.service_charge_payment_date}
                        onChange={(e) =>
                          setCurrentServiceChargeEntry((prev: any) => ({
                            ...prev,
                            service_charge_payment_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddServiceCharge}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Add Service Charge
                    </button>
                  </div>

                  {/* Table of serviceCharges */}
                  {formData.serviceCharges.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              वित्तीय वर्ष
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              सेवा शुल्क राशि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              विलंब शुल्क
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              कुल राशि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                              भुगतान तिथि
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.serviceCharges.map((sc: any, idx: number) => (
                            <tr key={idx} className="border-t">
                              <td className="px-4 py-2 text-sm">
                                {sc.service_charge_financial_year}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatIndianNumber(parseFloat(sc.service_charge_amount || "0"))}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatIndianNumber(parseFloat(sc.service_charge_late_fee || "0"))}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatIndianNumber(parseFloat(sc.service_charge_total || "0"))}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatDateToDDMMYYYY(sc.service_charge_payment_date) ||
                                  sc.service_charge_payment_date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
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
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-sm"
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
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
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
