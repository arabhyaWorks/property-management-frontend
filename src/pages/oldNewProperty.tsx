import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import BASE_URL from "../data/endpoint";
import formSteps from "../data/formSteps";
import ServiceChargeStep from "../components/propertyCreation/serviceChargeStep";

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
  if (date.getDate() !== newDate.getDate()) {
    newDate.setDate(0); // Set to last day of previous month if day overflows
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
  const [sampattiSreniOptions, setSampattiSreniOptions] = useState<string[]>(
    []
  );
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
        console.error("योोजनाओं को प्राप्त करने में त्रुटि:", error);
      }
    };
    fetchYojnas();
  }, []);

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
      // Update sampatti_sreni options
      setSampattiSreniOptions(selectedYojna.sampatti_sreni_list || []);
    } else {
      setSampattiSreniOptions([]); // Reset options if no yojna is selected
    }
  }, [formData.propertyRecord.yojna_id, yojnas]);

  // Calculate first_installment_due_date based on avantan_dinank
  useEffect(() => {
    const avantanDinank = formData.propertyRecord.avantan_dinank;
    if (avantanDinank) {
      const firstDueDate = addMonths(avantanDinank, 1);
      setFormData((prev: any) => ({
        ...prev,
        installmentPlan: {
          ...prev.installmentPlan,
          first_installment_due_date: firstDueDate,
        },
      }));
    }
  }, [formData.propertyRecord.avantan_dinank]);

  // Automatic Calculations
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

  // Prepopulate installment_amount and interest_amount
  useEffect(() => {
    if (currentStep === 4 && !currentPaymentEntry.installment_amount) {
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
    formData.installmentPlan,
    currentPaymentEntry.installment_amount,
  ]);

  // Calculate late_fee for current payment entry
  useEffect(() => {
    if (
      currentStep === 4 &&
      formData.installmentPlan.first_installment_due_date
    ) {
      const installmentNumber = formData.paymentInstallments.length + 1;
      const dueDate = addMonths(
        formData.installmentPlan.first_installment_due_date,
        (installmentNumber - 1) * 3
      );
      const paymentDate = currentPaymentEntry.payment_date;
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
  }, [
    currentPaymentEntry.payment_date,
    formData.installmentPlan.first_installment_due_date,
    formData.paymentInstallments.length,
    currentStep,
  ]);

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

    const installmentNumber = formData.paymentInstallments.length + 1;
    const dueDate = addMonths(
      formData.installmentPlan.first_installment_due_date,
      (installmentNumber - 1) * 3
    );

    setFormData((prev: any) => ({
      ...prev,
      paymentInstallments: [
        ...prev.paymentInstallments,
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

  const handlePrevious = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 6) return;

    const confirmSubmission = window.confirm(
      "क्या आप संपत्ति विवरण जमा करने के लिए निश्चित हैं?"
    );
    if (!confirmSubmission) return;

    setIsSubmitting(true);

    try {
      const payload = {
        propertyRecord: {
          ...formData.propertyRecord,
          bhavan_nirman:
            formData.propertyRecord.bhavan_nirman === "true" ? "हाँ" : "नहीं",
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
          avshesh_dhanrashi: parseFloat(
            formData.installmentPlan.avshesh_dhanrashi || "0"
          ),
          interest_rate: parseFloat(
            formData.installmentPlan.interest_rate || "0"
          ),
          time_period: parseFloat(formData.installmentPlan.time_period || "0"),
          total_interest_amount:
            (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
              parseFloat(formData.installmentPlan.interest_rate || "0") *
              parseFloat(formData.installmentPlan.time_period || "0")) /
            100,
          total_interest_amount_div_2:
            (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
              parseFloat(formData.installmentPlan.interest_rate || "0") *
              parseFloat(formData.installmentPlan.time_period || "0")) /
            100 /
            2,
          kul_yog:
            parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") +
            (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
              parseFloat(formData.installmentPlan.interest_rate || "0") *
              parseFloat(formData.installmentPlan.time_period || "0")) /
              100 /
              2,
          remaining_balance:
            parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") +
            (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
              parseFloat(formData.installmentPlan.interest_rate || "0") *
              parseFloat(formData.installmentPlan.time_period || "0")) /
              100 /
              2,
          ideal_number_of_installments: parseInt(
            formData.installmentPlan.ideal_number_of_installments || "1"
          ),
          ideal_installment_amount_per_installment:
            (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") +
              (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
                parseFloat(formData.installmentPlan.interest_rate || "0") *
                parseFloat(formData.installmentPlan.time_period || "0")) /
                100 /
                2) /
            parseInt(
              formData.installmentPlan.ideal_number_of_installments || "1"
            ),
          ideal_kisht_mool:
            parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") /
            parseInt(
              formData.installmentPlan.ideal_number_of_installments || "1"
            ),
          ideal_kisht_byaj:
            (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
              parseFloat(formData.installmentPlan.interest_rate || "0") *
              parseFloat(formData.installmentPlan.time_period || "0")) /
            100 /
            2 /
            parseInt(
              formData.installmentPlan.ideal_number_of_installments || "1"
            ),
          late_fee_per_day:
            (0.18 *
              ((parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") +
                (parseFloat(formData.installmentPlan.avshesh_dhanrashi || "0") *
                  parseFloat(formData.installmentPlan.interest_rate || "0") *
                  parseFloat(formData.installmentPlan.time_period || "0")) /
                  100 /
                  2) /
                parseInt(
                  formData.installmentPlan.ideal_number_of_installments || "1"
                ))) /
            365,
          first_installment_due_date: formatDateToDDMMYYYY(
            formData.installmentPlan.first_installment_due_date
          ),
        },
        installments: formData.paymentInstallments.map((payment: any) => ({
          payment_number: payment.payment_number,
          payment_amount:
            parseFloat(payment.installment_amount || "0") +
            parseFloat(payment.interest_amount || "0"),
          kisht_mool_paid: parseFloat(payment.installment_amount || "0"),
          kisht_byaj_paid: parseFloat(payment.interest_amount || "0"),
          payment_due_date: formatDateToDDMMYYYY(payment.due_date),
          payment_date: formatDateToDDMMYYYY(payment.payment_date),
          number_of_days_delayed:
            payment.payment_date && payment.due_date
              ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(payment.payment_date).getTime() -
                      new Date(payment.due_date).getTime()) /
                      (1000 * 3600 * 24)
                  )
                )
              : 0,
          late_fee_amount: parseFloat(payment.late_fee || "0"),
          total_payment_amount_with_late_fee:
            parseFloat(payment.installment_amount || "0") +
            parseFloat(payment.interest_amount || "0") +
            parseFloat(payment.late_fee || "0"),
        })),
        serviceCharges: formData.serviceCharges.map((charge: any) => ({
          service_charge_financial_year: charge.service_charge_financial_year,
          service_charge_amount: charge.service_charge_amount,
          service_charge_late_fee: charge.service_charge_late_fee,
          service_charge_total:
            (charge.service_charge_amount || 0) +
            (charge.service_charge_late_fee || 0),
          service_charge_payment_date: formatDateToDDMMYYYY(
            charge.service_charge_payment_date
          ),
        })),
      };

      const response = await fetch(`${BASE_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create property");
      }

      const yojnaId = payload.propertyRecord.yojna_id;
      window.location.href = `/yojna/${yojnaId}`;
    } catch (error) {
      console.error("Submission Error:", error);
      alert(`प्रॉपर्टी सबमिट करने में त्रुटि: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
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

              {currentStep === 4 &&
                formData.installmentPlan.first_installment_due_date && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      किस्त संख्या: {formData.paymentInstallments.length + 1}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      किस्त देय कि तिथि :{" "}
                      {formatDateToDDMMYYYY(
                        addMonths(
                          formData.installmentPlan.first_installment_due_date,
                          formData.paymentInstallments.length * 3
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

                  {formData.paymentInstallments.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              किस्त संख्या
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              देय तिथि
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
                              भुगतान तिथि
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                              कुल भुगतान राशि
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
                                  className="border-t border-gray-200 dark:border-gray-700"
                                >
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {payment.payment_number}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                    {formatDateToDDMMYYYY(payment.due_date)}
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

              {currentStep === 3 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    किश्त योजना सारांश
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
                        "1",
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
                            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                              {formatIndianNumber(adjustedInterest)}
                            </span>
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
                            तिमहि किस्त धनराशी
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
                            प्रति दिन विलंब धनराशी
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianNumber(lateFeePerDay)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            प्रथम किश्त देय तिथि
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatDateToDDMMYYYY(
                              formData.installmentPlan
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
