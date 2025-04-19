import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import BASE_URL from "../data/endpoint";
import ServiceChargeStep from "../components/propertyCreation/serviceChargeStep";
import formSteps from "../data/formSteps";
import { useNavigate, useParams } from "react-router-dom";

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

const addMonths = (dateString: string, months: number): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth() + months,
    date.getDate()
  );
  // If day overflows, set to last day of previous month
  if (date.getDate() !== newDate.getDate()) {
    newDate.setDate(0);
  }
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calculateLateFee = (
  dueDate: string,
  paymentDate: string,
  lfpd: number
): number => {
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

const formatDateToDDMMYYYY = (dateString: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const oldformatDateToYYYYMMDD = (dateString: string): string | null => {
  if (!dateString) return null;

  // console.log("dateString in dd-mm-yyyy",dateString)
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // return `${year}-${month}-${day}`;
  const dateYYYYMMDDDD = `${year}-${month}-${day}`;
  // console.log("dateYYYYMMDDDD",dateYYYYMMDDDD)
  // console.log({ "dd-mm-yyyy": dateString }, { "yyyy-mm-dd": dateYYYYMMDDDD });
  return dateYYYYMMDDDD;
};

const formatDateToYYYYMMDD = (dateString: string): string | null => {
  if (!dateString) return null;

  // Check if the date is already in YYYY-MM-DD format (e.g., 2020-02-01)
  const yyyyMMDDRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (yyyyMMDDRegex.test(dateString)) {
    // Validate that it's a valid date
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (
      !isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return dateString; // Return unchanged if valid YYYY-MM-DD
    }
    return null; // Invalid date
  }

  // Validate format DD-MM-YYYY (e.g., 01-02-2020)
  const ddMMYYYYRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (!ddMMYYYYRegex.test(dateString)) return null;

  // Split the date string into day, month, year
  const [day, month, year] = dateString.split("-").map(Number);

  // Create a Date object (months are 0-based in JavaScript)
  const date = new Date(year, month - 1, day);

  // Check if the date is valid and matches the input
  if (
    isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  // Format the date to YYYY-MM-DD
  const formattedYear = date.getFullYear();
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const dateYYYYMMDD = `${formattedYear}-${formattedMonth}-${formattedDay}`;

  // Log the input and output
  // console.log({ "dd-mm-yyyy": dateString }, { "yyyy-mm-dd": dateYYYYMMDD });

  return dateYYYYMMDD;
};

// (Optional) Aadhaar & mobile validations
const validateAadhaarNumber = (value: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(value);
};

const validateMobileNumber = (value: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(value);
};

// Main Component
export default function EditProperty({}) {
  const { property_id } = useParams(); // Get property_id from URL
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null); // To store the fetched property data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We'll split the data so it matches the new structure
  const [formData, setFormData] = useState<any>({
    propertyRecord: {}, // Basic allottee / personal info
    propertyRecordDetail: {}, // Detailed property financial info
    installments: [], // Payment installments
    serviceCharges: [], // Service charge data
  });

  // Fetch property details on component mount
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/properties/${property_id}`, {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          // },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();

        const propertyRecord = {
          ...data.propertyRecords[0],
        };

        const propertyRecordDetail = {
          ...data.propertyRecordDetail,
          panjikaran_dinank: formatDateToYYYYMMDD(
            data.propertyRecordDetail.panjikaran_dinank
          ),
          avantan_dinank: formatDateToYYYYMMDD(
            data.propertyRecordDetail.avantan_dinank
          ),
          first_installment_due_date: formatDateToYYYYMMDD(
            data.propertyRecordDetail.first_installment_due_date
          ),
          kabja_dinank: formatDateToYYYYMMDD(
            data.propertyRecords[0].kabja_dinank
          ),
          avshesh_vikray_mulya_ekmusht_jama_dinank: formatDateToYYYYMMDD(
            data.propertyRecordDetail.avshesh_vikray_mulya_ekmusht_jama_dinank
          ),
          bhavan_nirman:
            data.propertyRecordDetail.bhavan_nirman === "Yes"
              ? "true"
              : "false",
        };
        const installments = data.installments.map((inst) => ({
          ...inst,
          due_date: formatDateToYYYYMMDD(inst.payment_due_date),
          payment_date: formatDateToYYYYMMDD(inst.payment_date),
          installment_amount: inst.kisht_mool_paid,
          interest_amount: inst.kisht_byaj_paid,
        }));
        const serviceCharges = data.serviceCharges.map((charge) => ({
          ...charge,
          service_charge_payment_date: formatDateToYYYYMMDD(
            charge.service_charge_payment_date
          ),
        }));

        setFormData({
          propertyRecord,
          propertyRecordDetail,
          installments,
          serviceCharges,
        });

        console.log("Formatted Property Data");

        console.log({
          propertyRecord,
          propertyRecordDetail,
          installments,
          serviceCharges,
        });

        setPropertyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property_id]);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [currentPaymentEntry, setCurrentPaymentEntry] = useState<any>({
    installment_amount: "",
    interest_amount: "",
    late_fee: "",
    payment_date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // For controlling selects
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [sampattiSreniOptions, setSampattiSreniOptions] = useState<string[]>(
    []
  );

  const today = new Date().toISOString().split("T")[0];

  // Fetching yojnas
  useEffect(() => {
    const fetchYojnas = async () => {
      try {
        const response = await fetch(BASE_URL + "/api/yojna");
        const data = await response.json();
        setYojnas(data.data);
      } catch (error) {
        console.error("योजनाओं को प्राप्त करने में त्रुटि:", error);
      }
    };
    fetchYojnas();
  }, []);

  // Whenever yojna_id changes, update the detail fields from that yojna
  useEffect(() => {
    const selectedYojna = yojnas.find(
      (y) => y.yojna_id === formData.propertyRecord.yojna_id
    );
    if (selectedYojna) {
      setFormData((prev: any) => ({
        ...prev,
        propertyRecordDetail: {
          ...prev.propertyRecordDetail,
          interest_rate: selectedYojna.interest_rate,
          time_period: selectedYojna.time_period,
          ideal_number_of_installments: selectedYojna.number_of_installments,
        },
      }));
      // Update sampatti_sreni dropdown options
      setSampattiSreniOptions(selectedYojna.sampatti_sreni_list || []);
    } else {
      setSampattiSreniOptions([]);
    }
  }, [formData.propertyRecord.yojna_id, yojnas]);

  // Calculate first_installment_due_date based on avantan_dinank
  useEffect(() => {
    const avantanDinank = formData.propertyRecordDetail.avantan_dinank;
    if (avantanDinank) {
      const firstDueDate = addMonths(avantanDinank, 1);
      setFormData((prev: any) => ({
        ...prev,
        propertyRecordDetail: {
          ...prev.propertyRecordDetail,
          first_installment_due_date: firstDueDate,
        },
      }));
    }
  }, [formData.propertyRecordDetail.avantan_dinank]);

  // Updated avshesh_dhanrashi formula:
  // avshesh_dhanrashi = auction_keemat - (panjikaran_dhanrashi + avantan_dhanrashi + avshesh_vikray_mulya_ekmusht_jama_dhanrashi)
  useEffect(() => {
    const auctionKeemat = parseFloat(
      formData.propertyRecordDetail.auction_keemat || "0"
    );
    const panjikaranDhanrashi = parseFloat(
      formData.propertyRecordDetail.panjikaran_dhanrashi || "0"
    );
    const avantanDhanrashi = parseFloat(
      formData.propertyRecordDetail.avantan_dhanrashi || "0"
    );
    const avsheshVikrayMulyaEkmusht = parseFloat(
      formData.propertyRecordDetail
        .avshesh_vikray_mulya_ekmusht_jama_dhanrashi || "0"
    );
    // ekmusht_jama_dhanrashi treated as discount on avshesh_vikray_mulya_ekmusht_jama_dhanrashi
    const ekmusht_jama_dhanrashi = parseFloat(
      formData.propertyRecordDetail.ekmusht_jama_dhanrashi || "0"
    );

    const computedAvshesh =
      auctionKeemat -
      (panjikaranDhanrashi +
        avantanDhanrashi +
        avsheshVikrayMulyaEkmusht +
        ekmusht_jama_dhanrashi);

    setFormData((prev: any) => ({
      ...prev,
      propertyRecordDetail: {
        ...prev.propertyRecordDetail,
        avshesh_dhanrashi:
          computedAvshesh > 0 ? computedAvshesh.toFixed(2) : "0.00",
      },
    }));
  }, [
    formData.propertyRecordDetail.auction_keemat,
    formData.propertyRecordDetail.panjikaran_dhanrashi,
    formData.propertyRecordDetail.avantan_dhanrashi,
    formData.propertyRecordDetail.avshesh_vikray_mulya_ekmusht_jama_dhanrashi,
    formData.propertyRecordDetail.ekmusht_jama_dhanrashi,
  ]);

  // When on step 4 (adding "भुगतान किश्त विवरण"), prefill installment_amount & interest_amount
  useEffect(() => {
    if (currentStep === 4 && !currentPaymentEntry.installment_amount) {
      const avsheshDhanrashi = parseFloat(
        formData.propertyRecordDetail.avshesh_dhanrashi || "0"
      );
      const interestRate = parseFloat(
        formData.propertyRecordDetail.interest_rate || "0"
      );
      const timePeriod = parseFloat(
        formData.propertyRecordDetail.time_period || "0"
      );
      const idealNumberOfInstallments = parseInt(
        formData.propertyRecordDetail.ideal_number_of_installments || "1"
      );

      const totalInterestAmount =
        (avsheshDhanrashi * interestRate * timePeriod) / 100;
      const adjustedInterest = totalInterestAmount / 2;
      const idealKishtMool = avsheshDhanrashi / idealNumberOfInstallments;
      const idealKishtByaj = adjustedInterest / idealNumberOfInstallments;

      setCurrentPaymentEntry((prev: any) => ({
        ...prev,
        installment_amount: idealKishtMool.toFixed(2),
        interest_amount: idealKishtByaj.toFixed(2),
      }));
    }
  }, [
    currentStep,
    formData.propertyRecordDetail,
    currentPaymentEntry.installment_amount,
  ]);

  // Calculate late_fee for the current payment entry on step 4
  useEffect(() => {
    if (
      currentStep === 4 &&
      formData.propertyRecordDetail.first_installment_due_date
    ) {
      const installmentNumber = formData.installments.length + 1;
      const dueDate = addMonths(
        formData.propertyRecordDetail.first_installment_due_date,
        (installmentNumber - 1) * 3
      );
      const paymentDate = currentPaymentEntry.payment_date;

      const avsheshDhanrashi = parseFloat(
        formData.propertyRecordDetail.avshesh_dhanrashi || "0"
      );
      const interestRate = parseFloat(
        formData.propertyRecordDetail.interest_rate || "0"
      );
      const timePeriod = parseFloat(
        formData.propertyRecordDetail.time_period || "0"
      );
      const idealNumberOfInstallments = parseInt(
        formData.propertyRecordDetail.ideal_number_of_installments || "1"
      );

      const totalInterestAmount =
        (avsheshDhanrashi * interestRate * timePeriod) / 100;
      const adjustedInterest = totalInterestAmount / 2;
      const kulYog = avsheshDhanrashi + adjustedInterest;
      const idealInstallmentAmount = kulYog / idealNumberOfInstallments;
      const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365; // example logic

      if (paymentDate && dueDate) {
        const lateFee = calculateLateFee(dueDate, paymentDate, lateFeePerDay);
        setCurrentPaymentEntry((prev: any) => ({
          ...prev,
          late_fee: lateFee.toFixed(2),
        }));
      }
    }
  }, [
    currentPaymentEntry.payment_date,
    formData.propertyRecordDetail.first_installment_due_date,
    formData.installments.length,
    currentStep,
  ]);

  // Main handler
  const handleInputChange = (section: string, fieldId: string, value: any) => {
    // Installments step (handled separately)
    if (section === "installments") {
      setCurrentPaymentEntry((prev: any) => ({
        ...prev,
        [fieldId]: value === "" ? null : value,
      }));
      return;
    }

    // Default fallback
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldId]: value === "" ? null : value,
      },
    }));

    // File validation (already implemented in your version)
    if (fieldId === "aadhar_photo" && value) {
      const file = value as File;
      const maxSize = 200 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          aadhar_photo: "फ़ाइल का आकार 200KB से अधिक नहीं होना चाहिए",
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
    const { installment_amount, interest_amount, payment_date } =
      currentPaymentEntry;
    if (!installment_amount || !interest_amount || !payment_date) {
      alert("कृपया भुगतान जोड़ने से पहले सभी आवश्यक क्षेत्र भरें।");
      return;
    }

    const installmentNumber = formData.installments.length + 1;
    const dueDate = addMonths(
      formData.propertyRecordDetail.first_installment_due_date,
      (installmentNumber - 1) * 3
    );

    setFormData((prev: any) => ({
      ...prev,
      installments: [
        ...prev.installments,
        {
          ...currentPaymentEntry,
          payment_number: installmentNumber,
          due_date: dueDate,
        },
      ],
    }));

    setCurrentPaymentEntry({
      installment_amount: "",
      interest_amount: "",
      late_fee: "",
      payment_date: "",
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit on the final step (step 6)
    if (currentStep !== 6) return;

    const confirmSubmission = window.confirm(
      "क्या आप संपत्ति विवरण जमा करने के लिए निश्चित हैं?"
    );
    if (!confirmSubmission) return;

    setIsSubmitting(true);

    try {
      // Prepare final request body
      const pr = formData.propertyRecord;
      const prd = formData.propertyRecordDetail;

      // Convert bhavan_nirman to "Yes"/"No" as expected by API
      const bhavanNirmanValue =
        prd.bhavan_nirman === "true" || prd.bhavan_nirman === true
          ? "Yes"
          : "No";


      // Build payload matching API structure
      const payload = {
        propertyRecords: [
          {
            id: pr.id,
            yojna_id: pr.yojna_id,
            property_id: pr.property_id,
            user_id: pr.user_id,
            // "transfer_type": pr.transfer_type,
            // "from_user_id": pr.from_user_id,
            // "previous_record_id": pr.previous_record_id,
            // "next_record_id": pr.next_record_id,
            // "transfer_date": pr.transfer_date,
            // "relationship": pr.relationship,
            avanti_ka_naam: pr.avanti_ka_naam,
            pita_pati_ka_naam: pr.pita_pati_ka_naam,
            avanti_ka_sthayi_pata: pr.avanti_ka_sthayi_pata,
            avanti_ka_vartaman_pata: pr.avanti_ka_vartaman_pata,
            mobile_no: pr.mobile_no,
            kabja_dinank: formatDateToDDMMYYYY(prd.kabja_dinank),
            documentation_shulk: parseFloat(pr.documentation_shulk || "0"),
            aadhar_number: pr.aadhar_number,
            aadhar_photo_link:
              pr.aadhar_photo_link || "https://example.com/aadhar.jpg",
            documents_link: pr.documents_link || "https://example.com/doc.pdf",
          },
        ],
        propertyRecordDetail: {
          id: prd.id,
          property_id: prd.property_id,
          sampatti_sreni: prd.sampatti_sreni,
          avanti_sampatti_sankhya: prd.avanti_sampatti_sankhya,
          panjikaran_dhanrashi: parseFloat(prd.panjikaran_dhanrashi || "0"),
          panjikaran_dinank: formatDateToDDMMYYYY(prd.panjikaran_dinank),
          avantan_dhanrashi: parseFloat(prd.avantan_dhanrashi || "0"),
          avantan_dinank: formatDateToDDMMYYYY(prd.avantan_dinank),
          vikray_mulya: parseFloat(prd.vikray_mulya || "0"),
          free_hold_dhanrashi:
            parseFloat(prd.free_hold_dhanrashi || "0") || null,
          auction_keemat: parseFloat(prd.auction_keemat || "0"),
          lease_rent_dhanrashi:
            parseFloat(prd.lease_rent_dhanrashi || "0") || null,
          park_charge: parseFloat(prd.park_charge || "0") || null,
          corner_charge: parseFloat(prd.corner_charge || "0") || null,
          avshesh_vikray_mulya_ekmusht_jama_dhanrashi: parseFloat(
            prd.avshesh_vikray_mulya_ekmusht_jama_dhanrashi || "0"
          ),
          avshesh_vikray_mulya_ekmusht_jama_dinank: formatDateToDDMMYYYY(
            prd.avshesh_vikray_mulya_ekmusht_jama_dinank
          ),
          ekmusht_jama_dhanrashi:
            parseFloat(prd.ekmusht_jama_dhanrashi || "0") || 0,
          byaj_dhanrashi: parseFloat(prd.byaj_dhanrashi || "0") || 0,
          dinank: formatDateToDDMMYYYY(prd.dinank),
          kshetrafal: parseFloat(prd.kshetrafal || "0") || null,
          atirikt_bhoomi_ki_dhanrashi: parseFloat(
            prd.atirikt_bhoomi_ki_dhanrashi || "0"
          ),
          punarjivit_shulk: parseFloat(prd.punarjivit_shulk || "0"),
          praman_patra_shulk: parseFloat(prd.praman_patra_shulk || "0"),
          vigyapan_shulk: parseFloat(prd.vigyapan_shulk || "0"),
          nibandhan_shulk: parseFloat(prd.nibandhan_shulk || "0"),
          nibandhan_dinank: formatDateToDDMMYYYY(prd.nibandhan_dinank),
          patta_bhilekh_dinank:
            formatDateToDDMMYYYY(prd.patta_bhilekh_dinank) || null,
          bhavan_manchitra_swikrit_manchitra:
            prd.bhavan_manchitra_swikrit_manchitra || null,
          bhavan_nirman: bhavanNirmanValue,
          jama_dhan_rashi_dinank:
            formatDateToDDMMYYYY(prd.jama_dhan_rashi_dinank) || null,
          jama_dhan_rashid_sankhya: prd.jama_dhan_rashid_sankhya || null,
          sewer_connection_water_connection_charge: parseFloat(
            prd.sewer_connection_water_connection_charge || "0"
          ),
          labansh: prd.labansh || "",
          anya: prd.anya || "",
          abhiyookti: prd.abhiyookti || "",
          property_floor_type: prd.property_floor_type || "",
          avshesh_dhanrashi: parseFloat(prd.avshesh_dhanrashi || "0"),
          interest_rate: parseFloat(prd.interest_rate || "0"),
          time_period: parseFloat(prd.time_period || "0"),
          total_interest_amount:
            (parseFloat(prd.avshesh_dhanrashi || "0") *
              parseFloat(prd.interest_rate || "0") *
              parseFloat(prd.time_period || "0")) /
            100,
          total_interest_amount_div_2:
            (parseFloat(prd.avshesh_dhanrashi || "0") *
              parseFloat(prd.interest_rate || "0") *
              parseFloat(prd.time_period || "0")) /
            100 /
            2,
          kul_yog:
            parseFloat(prd.avshesh_dhanrashi || "0") +
            (parseFloat(prd.avshesh_dhanrashi || "0") *
              parseFloat(prd.interest_rate || "0") *
              parseFloat(prd.time_period || "0")) /
              100 /
              2,
          ideal_number_of_installments: parseInt(
            prd.ideal_number_of_installments || "1"
          ),
          ideal_installment_amount_per_installment: (() => {
            const base =
              parseFloat(prd.avshesh_dhanrashi || "0") +
              (parseFloat(prd.avshesh_dhanrashi || "0") *
                parseFloat(prd.interest_rate || "0") *
                parseFloat(prd.time_period || "0")) /
                100 /
                2;
            const n = parseInt(prd.ideal_number_of_installments || "1");
            return base / n;
          })(),
          ideal_kisht_mool:
            parseFloat(prd.avshesh_dhanrashi || "0") /
            parseInt(prd.ideal_number_of_installments || "1"),
          ideal_kisht_byaj: (() => {
            const totalInterest =
              (parseFloat(prd.avshesh_dhanrashi || "0") *
                parseFloat(prd.interest_rate || "0") *
                parseFloat(prd.time_period || "0")) /
              100;
            const halfInt = totalInterest / 2;
            const n = parseInt(prd.ideal_number_of_installments || "1");
            return halfInt / n;
          })(),
          late_fee_per_day: (() => {
            const base =
              parseFloat(prd.avshesh_dhanrashi || "0") +
              (parseFloat(prd.avshesh_dhanrashi || "0") *
                parseFloat(prd.interest_rate || "0") *
                parseFloat(prd.time_period || "0")) /
                100 /
                2;
            const n = parseInt(prd.ideal_number_of_installments || "1");
            const ideal = base / n;
            return (0.18 * ideal) / 365;
          })(),
          first_installment_due_date: formatDateToDDMMYYYY(
            prd.first_installment_due_date
          ),
        },
        installments: formData.installments.map((payment: any) => {
          const payAmount =
            parseFloat(payment.installment_amount || "0") +
            parseFloat(payment.interest_amount || "0");
          const daysDelayed =
            payment.payment_date && payment.due_date
              ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(payment.payment_date).getTime() -
                      new Date(payment.due_date).getTime()) /
                      (1000 * 3600 * 24)
                  )
                )
              : 0;
          return {
            ...(payment.payment_id && { payment_id: payment.payment_id }),
            property_id: pr.property_id,
            property_record_id: prd.id, // Corrected to use prd.id
            payment_number: payment.payment_number,
            payment_amount: payAmount,
            user_id: pr.user_id,
            kisht_mool_paid: parseFloat(payment.installment_amount || "0"),
            kisht_byaj_paid: parseFloat(payment.interest_amount || "0"),
            payment_due_date: formatDateToYYYYMMDD(payment.due_date),
            payment_date: formatDateToYYYYMMDD(payment.payment_date),
            number_of_days_delayed: daysDelayed,
            late_fee_amount: parseFloat(payment.late_fee || "0"),
            total_payment_amount_with_late_fee:
              payAmount + parseFloat(payment.late_fee || "0"),
          };
        }),
        serviceCharges: formData.serviceCharges
          .map((charge: any) => ({
            ...(charge.service_charge_id && {
              service_charge_id: charge.service_charge_id,
            }),
            property_id: pr.property_id,
            property_record_id: prd.id, // Corrected to use prd.id
            service_charge_financial_year: charge.service_charge_financial_year,
            service_charge_amount: parseFloat(
              charge.service_charge_amount || "0"
            ),
            service_charge_late_fee: parseFloat(
              charge.service_charge_late_fee || "0"
            ),
            user_id: pr.user_id,
            service_charge_total:
              parseFloat(charge.service_charge_amount || "0") +
              parseFloat(charge.service_charge_late_fee || "0"),
            service_charge_payment_date: formatDateToDDMMYYYY(
              charge.service_charge_payment_date
            ),
          })),
      };

      // Log payload for debugging
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

alert("are you sure to update property?")

      // Send PUT request to update property
      const response = await fetch(
        `${BASE_URL}/properties/${prd.property_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Uncomment and adjust if authentication is required:
            // "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(result.message || "Failed to update property");
      }

      // Redirect to yojna page after successful update
      const yojnaId = payload.propertyRecords[0].yojna_id;
      window.location.href = `/yojna/${yojnaId}`;
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`प्रॉपर्टी अपडेट करने में त्रुटि: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const sectionMap: { [key: number]: string } = {
    0: "propertyRecord",
    1: "propertyRecordDetail",
    2: "propertyRecordDetail",
    3: "propertyRecordDetail",
    4: "installments",
    5: "propertyRecordDetail",
    6: "serviceCharges",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-blue-600 font-semibold text-xl">
            Loading...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
            <p className="text-red-500 font-medium">Error: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!propertyData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-blue-200 border border-blue-200 rounded-lg p-6 shadow-md">
            <p className="text-blue-600 font-medium">No data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              नई संपत्ति बनाएँ
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto px-2 custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                  {formSteps[currentStep].title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {formSteps[currentStep].title} के लिए विवरण भरें।
                </p>
              </div>

              {currentStep === 6 ? (
                // The dedicated service charge step
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
                    if (sectionMap[currentStep] === "installments") {
                      // Step 4
                      fieldValue = currentPaymentEntry[field.id] || "";
                    } else {
                      // propertyRecord / propertyRecordDetail / serviceCharges
                      fieldValue =
                        formData[sectionMap[currentStep]][field.id] || "";
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
                              विकल्प चुनें...
                            </option>
                            {field.id === "yojna_id"
                              ? yojnas.map((yojna) => (
                                  <option
                                    key={yojna.yojna_id}
                                    value={yojna.yojna_id}
                                    className="dark:bg-gray-800"
                                  >
                                    {yojna.yojna_name}
                                  </option>
                                ))
                              : field.id === "sampatti_sreni"
                              ? sampattiSreniOptions.map((option) => (
                                  <option
                                    key={option}
                                    value={option}
                                    className="dark:bg-gray-800"
                                  >
                                    {option}
                                  </option>
                                ))
                              : field.options?.map((option) => (
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
                            placeholder={`${field.label} दर्ज करें`}
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
                              चुनें...
                            </option>
                            <option value="true" className="dark:bg-gray-800">
                              हाँ
                            </option>
                            <option value="false" className="dark:bg-gray-800">
                              नहीं
                            </option>
                          </select>
                        ) : field.type === "file" ? (
                          <input
                            type="file"
                            accept={field.accept}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
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
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            value={fieldValue}
                            max={today}
                            onChange={(e) =>
                              handleInputChange(
                                sectionMap[currentStep],
                                field.id,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <input
                            type={field.type}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm"
                            placeholder={`${field.label} दर्ज करें`}
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
                        {errors[field.id] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[field.id]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* If we're on step 4 (installment creation), show installment details */}
              {currentStep === 4 &&
                formData.propertyRecordDetail.first_installment_due_date && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      किस्त संख्या: {formData.installments.length + 1}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      किस्त देय तिथि:
                      {" " +
                        formatDateToDDMMYYYY(
                          addMonths(
                            formData.propertyRecordDetail
                              .first_installment_due_date,
                            formData.installments.length * 3
                          )
                        )}
                    </p>
                  </div>
                )}

              {currentStep === 4 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 font-medium transition-colors flex items-center shadow-sm"
                  >
                    भुगतान जोड़ें
                  </button>

                  {formData.installments.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              किस्त संख्या
                            </th>

                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              किस्त धनराशि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              ब्याज धनराशि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              विलंब शुल्क
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              देय तिथि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              भुगतान तिथि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              कुल भुगतान राशि
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.installments.map(
                            (payment: any, index: number) => {
                              const totalPaymentAmount =
                                parseFloat(payment.installment_amount || "0") +
                                parseFloat(payment.interest_amount || "0") +
                                parseFloat(payment.late_fee || "0");
                              return (
                                <tr
                                  key={index}
                                  className="border-t border-gray-200 dark:border-gray-700"
                                >
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {payment.payment_number}
                                  </td>

                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {formatIndianNumber(
                                      parseFloat(
                                        payment.installment_amount || "0"
                                      )
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {formatIndianNumber(
                                      parseFloat(payment.interest_amount || "0")
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {formatIndianNumber(
                                      parseFloat(payment.late_fee || "0")
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {formatDateToDDMMYYYY(payment.due_date)}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {formatDateToDDMMYYYY(payment.payment_date)}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
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

              {/* Step 3 summary: किश्त योजना सारांश */}
              {currentStep === 3 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    किश्त योजना सारांश
                  </h4>
                  {(() => {
                    const avsheshDhanrashi = parseFloat(
                      formData.propertyRecordDetail.avshesh_dhanrashi || "0"
                    );
                    const interestRate = parseFloat(
                      formData.propertyRecordDetail.interest_rate || "0"
                    );
                    const timePeriod = parseFloat(
                      formData.propertyRecordDetail.time_period || "0"
                    );
                    const idealNumberOfInstallments = parseInt(
                      formData.propertyRecordDetail
                        .ideal_number_of_installments || "1",
                      10
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
                    const lateFeePerDay = (0.18 * idealInstallmentAmount) / 365;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            अवशेष धनराशि
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(avsheshDhanrashi)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            कुल ब्याज राशि (एक वर्ष)
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(totalInterestAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ब्याज राशि (छह महीने)
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(adjustedInterest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            कुल योग
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(kulYog)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            तिमाही किस्त धनराशी
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(idealInstallmentAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            किस्त मूल धनराशी
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(idealKishtMool)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            किस्त ब्याज धनराशी
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(idealKishtByaj)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            प्रति दिन विलंब धनराशि
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(lateFeePerDay)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            प्रथम किस्त की देय तिथि
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatDateToDDMMYYYY(
                              formData.propertyRecordDetail
                                .first_installment_due_date
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
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
                    पिछला
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
                    अगला
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
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
                        जमा हो रहा है...
                      </>
                    ) : (
                      <>
                        जमा करें
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414l4-4a1 1 0 011.414 0z"
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
