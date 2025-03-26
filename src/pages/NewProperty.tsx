import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn"; // Utility for combining classNames (assumed)
import { DashboardLayout } from "../components/layout/DashboardLayout"; // Layout component (assumed)
import BASE_URL from "../data/endpoint";

//
// ----------------------------- Form Structures -----------------------------
//

// Each "step" in our wizard: a title & a list of fields
interface FormStep {
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "boolean";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
}

// Base financial year options (will be narrowed down dynamically)
const baseFinancialYearOptions = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

// Multi-step form definition
const formSteps: FormStep[] = [
  {
    title: "Basic Information",
    fields: [
      {
        id: "yojna_id",
        label: "योजना का नाम",
        type: "select",
        options: [], // We'll fill from API
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
        id: "aadhar_photo_link",
        label: "आधार फोटो लिंक",
        type: "text",
      },
      {
        id: "documents_link",
        label: "दस्तावेज़ लिंक",
        type: "text",
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
      { id: "vikray_mulya", label: "विक्रय मूल्य", type: "number", required: true },
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
      { id: "park_charge", label: "पार्क चार्ज", type: "number" },
      { id: "corner_charge", label: "कॉर्नर चार्ज", type: "number" },
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
      {
        id: "service_charge_financial_year",
        label: "वित्तीय वर्ष",
        type: "select",
        options: [],
        required: true,
      },
      {
        id: "service_charge_amount",
        label: "सेवा शुल्क राशि",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "service_charge_late_fee",
        label: "सेवा शुल्क विलंब शुल्क",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "service_charge_payment_date",
        label: "सेवा शुल्क भुगतान तिथि",
        type: "date",
        required: true,
      },
    ],
  },
];

//
// ----------------------------- Utility Functions -----------------------------
//

// Indian number system formatting (crore, lakh, thousand, etc.)
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

// Calculate next due date, assuming quarterly increments
const calculateNextDueDate = (startDate: string): string => {
  if (!startDate) return "";
  const date = new Date(startDate);
  const nextDate = new Date(date.setMonth(date.getMonth() + 3));
  // If the date is beyond the last day of the month, adjust:
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

// Calculate late fee for installments
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

// Determine the financial year string for a given date
const getFinancialYearFromDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  // If before April (month < 3), the FY starts the previous year
  const financialYear = month < 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
  console.log(financialYear)
  return financialYear;
};

// Generate a list of consecutive financial years up to 2025 based on allotment FY
const generateFinancialYearOptions = (allotmentDate: string): string[] => {
  const allotmentFY = getFinancialYearFromDate(allotmentDate);
  const [startYear] = allotmentFY.split("-").map(Number);

  const options: string[] = [];
  // You can adjust how far you go in the future
  for (let year = startYear; year <= 2025; year++) {
    options.push(`${year}-${year + 1}`);
  }
  console.log(options)
  return options;
};

// Calculate service charge late fee based on delay
const calculateServiceChargeLateFee = (
  allotmentFY: string,
  selectedFY: string,
  paymentDate: string,
  serviceChargeAmount: number
): number => {
  if (!allotmentFY || !selectedFY || !paymentDate) return 0;

  // Payment is "due" by 31 March of the selected FY's end year
  // e.g. if selectedFY is '2023-2024', due date is 2024-03-31
  const [selectedStartYear] = selectedFY.split("-").map(Number);
  const dueDate = new Date(`${selectedStartYear + 1}-03-31`);

  const payment = new Date(paymentDate);

  // If paid on or before due date, no late fee
  if (payment <= dueDate) return 0;

  // For demonstration, we use this fixed "current date" from the system
  // (You can replace with new Date() or your actual system date)
  const currentDate = new Date("2025-03-23");

  // How many years are we behind?
  const yearsDelayed = currentDate.getFullYear() - (selectedStartYear + 1);

  // Late fees:
  //  - 5% for 1-year delay
  //  - 10% for 2-year delay
  //  - 15% for >=3 years
  if (yearsDelayed <= 0) return 0;
  if (yearsDelayed === 1) return serviceChargeAmount * 0.05;
  if (yearsDelayed === 2) return serviceChargeAmount * 0.1;
  if (yearsDelayed >= 3) return serviceChargeAmount * 0.15;

  return 0;
};

// Format date as dd-mm-yyyy
const formatDateToDDMMYYYY = (dateString: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [financialYearOptions, setFinancialYearOptions] = useState<string[]>([]);

  //
  // ----------------------------- Data Fetching -----------------------------
  //
  // 1. Fetch all yojnas for the yojna_id dropdown
  useEffect(() => {
    const fetchYojnas = async () => {
      try {
        const response = await fetch(BASE_URL+"/api/yojnas");
        const data = await response.json();
        setYojnas(data.data);
      } catch (error) {
        console.error("Error fetching yojnas:", error);
      }
    };
    fetchYojnas();
  }, []);

  // 2. Fill installment plan fields from the selected yojna
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
  // A. Automatically calculate Avshesh = auction_keemat - (panjikaran + avantan)
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

  // B. Calculate next due date (quarterly) after user sets the start date
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

  // C. Payment Installment Late Fee (when user sets a payment date on Step 4)
  useEffect(() => {
    if (currentStep === 4) {
      const paymentDate = formData.paymentInstallments[0]?.payment_date;
      const dueDate = formData.installmentPlan.next_due_date;
      const avsheshDhanrashi = parseFloat(
        formData.installmentPlan.avshesh_dhanrashi || "0"
      );
      const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
      const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
      const idealNumberOfInstallments = parseInt(
        formData.installmentPlan.ideal_number_of_installments || "1"
      );

      // TIA & Kul Yog calculations
      const totalInterestAmount = (avsheshDhanrashi * interestRate * timePeriod) / 100;
      const adjustedInterest = totalInterestAmount / 2;
      const kulYog = avsheshDhanrashi + adjustedInterest;
      const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
      // Late fee per day
      const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

      if (paymentDate && dueDate) {
        const lateFee = calculateLateFee(dueDate, paymentDate, lateFeePerDay);
        setFormData((prev: any) => ({
          ...prev,
          paymentInstallments: [
            {
              ...prev.paymentInstallments[0],
              late_fee: lateFee,
            },
          ],
        }));
      }
    }
  }, [
    formData.paymentInstallments[0]?.payment_date,
    formData.installmentPlan.next_due_date,
    currentStep,
  ]);

  // D. Dynamically generate list of FY for user to choose from (Step 6) based on allotment date
  useEffect(() => {
    const allotmentDate = formData.propertyRecord.avantan_dinank;
    if (allotmentDate) {
      const options = generateFinancialYearOptions(allotmentDate);
      setFinancialYearOptions(options);

      // If user hasn't selected any FY yet, default to earliest in the list
      if (!formData.serviceCharges[0]?.service_charge_financial_year) {
        setFormData((prev: any) => ({
          ...prev,
          serviceCharges: [
            {
              ...prev.serviceCharges[0],
              service_charge_financial_year: options[0],
            },
          ],
        }));
      }
    }
  }, [formData.propertyRecord.avantan_dinank]);

  // E. Service charge & late fee calculations whenever user is on step 6
  useEffect(() => {
    if (currentStep === 6) {
      const floorType = formData.propertyRecord.property_floor_type;
      // Base annual service charge
      const serviceChargeAmount =
        floorType === "LGF" ? 10610 : floorType === "UGF" ? 11005 : 0;

      const allotmentFY = getFinancialYearFromDate(
        formData.propertyRecord.avantan_dinank
      );
      const selectedFY =
        formData.serviceCharges[0]?.service_charge_financial_year || allotmentFY;
      const paymentDate = formData.serviceCharges[0]?.service_charge_payment_date;

      // Late fee for the chosen FY
      const lateFee = paymentDate
        ? calculateServiceChargeLateFee(
            allotmentFY,
            selectedFY,
            paymentDate,
            serviceChargeAmount
          )
        : 0;

      // We also track total
      const totalServiceCharge = serviceChargeAmount + lateFee;

      setFormData((prev: any) => ({
        ...prev,
        serviceCharges: [
          {
            ...prev.serviceCharges[0],
            service_charge_amount: serviceChargeAmount,
            service_charge_late_fee: lateFee,
            // If you want to store the total as well
            service_charge_total: totalServiceCharge,
          },
        ],
      }));
    }
  }, [
    currentStep,
    formData.propertyRecord.property_floor_type,
    formData.serviceCharges[0]?.service_charge_financial_year,
    formData.serviceCharges[0]?.service_charge_payment_date,
    formData.propertyRecord.avantan_dinank,
  ]);

  //
  // ----------------------------- Handlers -----------------------------
  //
  // For updating form fields in state
  const handleInputChange = (section: string, fieldId: string, value: any) => {
    // For arrays like "paymentInstallments" or "serviceCharges", we store single object at index [0]
    if (section === "paymentInstallments" || section === "serviceCharges") {
      if (formData[section].length === 0) {
        setFormData((prev: any) => ({
          ...prev,
          [section]: [{ [fieldId]: value === "" ? null : value }],
        }));
      } else {
        setFormData((prev: any) => ({
          ...prev,
          [section]: [
            {
              ...prev[section][0],
              [fieldId]: value === "" ? null : value,
            },
          ],
        }));
      }
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [fieldId]: value === "" ? null : value,
        },
      }));
    }
  };

  // Step navigation
  const handleNext = () =>
    setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
  const handlePrevious = () =>
    setCurrentStep((prev) => Math.max(0, prev - 1));

  // Final Submit (step 6)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only actually submit on the final step
    if (currentStep !== 6) return;

    const confirmSubmission = window.confirm(
      "Are you sure you want to submit the property details?"
    );
    if (!confirmSubmission) return;

    setIsSubmitting(true);

    // Compute final fields for the payload
    const avsheshDhanrashi = parseFloat(
      formData.installmentPlan.avshesh_dhanrashi || "0"
    );
    const interestRate = parseFloat(formData.installmentPlan.interest_rate || "0");
    const timePeriod = parseFloat(formData.installmentPlan.time_period || "0");
    const idealNumberOfInstallments = parseInt(
      formData.installmentPlan.ideal_number_of_installments || "1"
    );

    // TIA, TIA/2, Kul Yog, etc.
    const totalInterestAmount =
      (avsheshDhanrashi * interestRate * timePeriod) / 100;
    const adjustedInterest = totalInterestAmount / 2;
    const kulYog = avsheshDhanrashi + adjustedInterest;
    const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
    const idealKishtMool = avsheshDhanrashi / idealNumberOfInstallments;
    const idealKishtByaj = adjustedInterest / idealNumberOfInstallments;
    const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

    // Prepare final payload structure
    const payload = {
      propertyRecord: {
        ...formData.propertyRecord,
        // Convert 'true'/'false' => 'Yes'/'No'
        bhavan_nirman:
          formData.propertyRecord.bhavan_nirman === "true" ? "Yes" : "No",
        // Format date fields to dd-mm-yyyy
        panjikaran_dinank: formatDateToDDMMYYYY(
          formData.propertyRecord.panjikaran_dinank
        ),
        avantan_dinank: formatDateToDDMMYYYY(
          formData.propertyRecord.avantan_dinank
        ),
        kabja_dinank: formatDateToDDMMYYYY(
          formData.propertyRecord.kabja_dinank
        ),
        nibandhan_dinank: formatDateToDDMMYYYY(
          formData.propertyRecord.nibandhan_dinank
        ),
      },
      installmentPlan: {
        avshesh_dhanrashi: avsheshDhanrashi,
        interest_rate: interestRate,
        time_period: timePeriod,
        total_interest_amount: totalInterestAmount,
        total_interest_amount_div_2: adjustedInterest,
        kul_yog: kulYog,
        remaining_balance: kulYog, // Start with the full Kul Yog
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
      paymentInstallments: formData.paymentInstallments.map((payment: any) => ({
        ...payment,
        payment_date: formatDateToDDMMYYYY(payment.payment_date),
        payment_due_date: formatDateToDDMMYYYY(
          formData.installmentPlan.next_due_date
        ),
        payment_amount:
          parseFloat(payment.installment_amount || "0") +
          parseFloat(payment.interest_amount || "0"),
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
        late_fee_amount: payment.late_fee || 0,
      })),
      serviceCharges: formData.serviceCharges.map((charge: any) => ({
        service_charge_financial_year: charge.service_charge_financial_year,
        service_charge_amount: charge.service_charge_amount,
        service_charge_late_fee: charge.service_charge_late_fee,
        // Also store the total if desired
        service_charge_total:
          (charge.service_charge_amount || 0) +
          (charge.service_charge_late_fee || 0),
        service_charge_payment_date: formatDateToDDMMYYYY(
          charge.service_charge_payment_date
        ),
      })),
    };

    // Log to check the payload
    console.log(payload);

    // Submit to server
    // try {
    //   const response = await fetch(BASE_URL+"/api/properties", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization:
    //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQURNSU4tMTc0MjU0MTQ0MzQwOCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MjU0ODIyMiwiZXhwIjoxNzQyNTUxODIyfQ.p6D2houIQAP_Sp18TWAx9X3c2Aj6WkZnKAIgUy4l9u8",
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     console.log("Property added successfully:", result);
    //   } else {
    //     console.error("Failed to add property:", response.statusText);
    //   }
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  //
  // ----------------------------- Step -> State Section Mapping -----------------------------
  //
  // We store data in different parts of formData; map the step index to the correct section
  const sectionMap: { [key: number]: string } = {
    0: "propertyRecord",
    1: "propertyRecord",
    2: "propertyRecord",
    3: "installmentPlan",
    4: "paymentInstallments",
    5: "propertyRecord",
    6: "serviceCharges",
  };

  //
  // ----------------------------- Rendering -----------------------------
  //
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

          {/* Actual form fields for the current step */}
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Scrollable container if needed */}
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto px-2 custom-scrollbar">
              {/* Section Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                  {formSteps[currentStep].title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Fill in the details for{" "}
                  {formSteps[currentStep].title.toLowerCase()}.
                </p>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {formSteps[currentStep].fields.map((field) => {
                  // Value for read/write controls
                  let fieldValue: any = "";
                  // If the section is an array (paymentInstallments or serviceCharges)
                  if (sectionMap[currentStep] === "paymentInstallments" || sectionMap[currentStep] === "serviceCharges") {
                    fieldValue =
                      formData[sectionMap[currentStep]][0]?.[field.id] || "";
                  } else {
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
                      {/* Read-only? */}
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
                          onChange={(e) =>
                            handleInputChange(
                              sectionMap[currentStep],
                              field.id,
                              e.target.value
                            )
                          }
                          value={fieldValue}
                        >
                          <option value="" className="dark:bg-gray-800">
                            Select option...
                          </option>
                          {field.id === "yojna_id"
                            ? // Yojna list from API
                              yojnas.map((yojna) => (
                                <option
                                  key={yojna.yojna_id}
                                  value={yojna.yojna_id}
                                  className="dark:bg-gray-800"
                                >
                                  {yojna.yojna_name}
                                </option>
                              ))
                            : field.id === "service_charge_financial_year"
                            ? // Generated financial years
                              financialYearOptions.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  className="dark:bg-gray-800"
                                >
                                  {option}
                                </option>
                              ))
                            : // Static select options
                              field.options?.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  className="dark:bg-gray-800"
                                >
                                  {option}
                                </option>
                              ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm min-h-24"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
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
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                          onChange={(e) =>
                            handleInputChange(
                              sectionMap[currentStep],
                              field.id,
                              e.target.value
                            )
                          }
                          value={fieldValue}
                        >
                          <option value="" className="dark:bg-gray-800">
                            Select...
                          </option>
                          <option value="true" className="dark:bg-gray-800">
                            Yes
                          </option>
                          <option value="false" className="dark:bg-gray-800">
                            No
                          </option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          value={fieldValue}
                          onChange={(e) =>
                            handleInputChange(
                              sectionMap[currentStep],
                              field.id,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Installment Plan Summary (Step 3) */}
              {currentStep === 3 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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
                      formData.installmentPlan.ideal_number_of_installments ||
                        "1"
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
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Avshesh Dhanrashi
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(avsheshDhanrashi)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total Interest Amount
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(totalInterestAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Adjusted Interest (TIA / 2)
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(adjustedInterest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Kul Yog
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(kulYog)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ideal Installment (Per Installment)
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(idealInstallmentAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Principal per Installment (Kisht Mool)
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(idealKishtMool)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Interest per Installment (Kisht Byaj)
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(idealKishtByaj)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Late Fee per Day
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(lateFeePerDay)}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Step Navigation */}
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
                    className="px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-medium transition-colors flex items-center shadow-sm"
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
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
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