import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import BASE_URL from "../../data/endpoint";

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
}

const formSteps: FormStep[] = [
  {
    title: "Basic Information",
    fields: [
      { id: "yojna_id", label: "योजना का नाम", type: "text", required: true },
      { id: "avanti_ka_naam", label: "आवंटी का नाम", type: "text", required: true },
      { id: "pita_pati_ka_naam", label: "पिता/पति का नाम", type: "text", required: true },
      { id: "avanti_ka_sthayi_pata", label: "आवंटी का स्थायी पता", type: "textarea", required: true },
      { id: "avanti_ka_vartaman_pata", label: "आवंटी का वर्तमान पता", type: "textarea", required: true },
      { id: "mobile_no", label: "मोबाइल नंबर", type: "text", required: true },
      { id: "aadhar_number", label: "आधार नंबर", type: "text" },
      { id: "aadhar_photo_link", label: "आधार फोटो लिंक", type: "text" },
      { id: "documents_link", label: "दस्तावेज़ लिंक", type: "text" },
    ],
  },
  {
    title: "Property Details",
    fields: [
      { id: "sampatti_sreni", label: "संपत्ति श्रेणी", type: "select", options: ["आवासीय", "वाणिज्यिक"], required: true },
      { id: "avanti_sampatti_sankhya", label: "संपत्ति संख्या", type: "text", required: true },
      { id: "property_floor_type", label: "फ्लोर प्रकार", type: "text" },
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
      { id: "vikray_mulya", label: "विक्रय धनराशि", type: "number", required: true },
      { id: "auction_keemat", label: "नीलामी धनराशि", type: "number" },
      { id: "lease_rent_dhanrashi", label: "लीज रेंट धनराशि", type: "number" },
      { id: "free_hold_dhanrashi", label: "फ्री होल्ड धनराशि", type: "number" },
    ],
  },
  {
    title: "Installment Plan",
    fields: [
      { id: "avshesh_dhanrashi", label: "अवशेष धनराशि", type: "number", required: true },
      { id: "interest_rate", label: "ब्याज दर (%)", type: "number", required: true },
      { id: "time_period", label: "समय अवधि (वर्ष)", type: "number", required: true },
      { id: "ideal_number_of_installments", label: "किश्तों की संख्या", type: "number", required: true },
      { id: "start_date_of_installment_year", label: "किश्त शुरू होने की तारीख", type: "date", required: true },
      { id: "next_due_date", label: "अगली किश्त की तारीख", type: "date", required: true },
    ],
  },
  {
    title: "Additional Charges & Details",
    fields: [
      { id: "park_charge", label: "पार्क चार्ज", type: "number" },
      { id: "corner_charge", label: "कॉर्नर चार्ज", type: "number" },
      { id: "atirikt_bhoomi_ki_dhanrashi", label: "अतिरिक्त भूमि की धनराशि", type: "number" },
      { id: "punarjivit_shulk", label: "पुनर्जीवित शुल्क", type: "number" },
      { id: "praman_patra_shulk", label: "प्रमाण पत्र शुल्क", type: "number" },
      { id: "vigyapan_shulk", label: "विज्ञापन शुल्क", type: "number" },
      { id: "nibandhan_shulk", label: "निबंधन शुल्क", type: "number" },
      { id: "nibandhan_dinank", label: "निबंधन दिनांक", type: "date" },
      { id: "labansh", label: "लाभांश", type: "text" },
      { id: "anya", label: "अन्य टिप्पणी", type: "textarea" },
    ],
  },
];

interface AddPropertyFormProps {
  onClose: () => void;
}

export default function AddPropertyForm({ onClose }: AddPropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    propertyRecord: {},
    installmentPlan: {},
    installments: [],
    serviceCharges: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section: string, fieldId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldId]: value === "" ? null : value,
      },
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the payload based on the cURL structure
    const payload = {
      propertyRecord: {
        ...formData.propertyRecord,
        bhavan_nirman: formData.propertyRecord.bhavan_nirman === "true" ? "Yes" : "No",
      },
      installmentPlan: {
        ...formData.installmentPlan,
        total_interest_amount:
          (formData.installmentPlan.avshesh_dhanrashi || 0) * (formData.installmentPlan.interest_rate || 0) / 100,
        total_interest_amount_div_2:
          ((formData.installmentPlan.avshesh_dhanrashi || 0) * (formData.installmentPlan.interest_rate || 0) / 100) / 2,
        kul_yog:
          (formData.installmentPlan.avshesh_dhanrashi || 0) +
          ((formData.installmentPlan.avshesh_dhanrashi || 0) * (formData.installmentPlan.interest_rate || 0) / 100),
        remaining_balance:
          ((formData.installmentPlan.avshesh_dhanrashi || 0) +
            ((formData.installmentPlan.avshesh_dhanrashi || 0) * (formData.installmentPlan.interest_rate || 0) / 100)) /
          (formData.installmentPlan.ideal_number_of_installments || 1),
        ideal_installment_amount_per_installment:
          ((formData.installmentPlan.avshesh_dhanrashi || 0) +
            ((formData.installmentPlan.avshesh_dhanrashi || 0) * (formData.installmentPlan.interest_rate || 0) / 100)) /
          (formData.installmentPlan.ideal_number_of_installments || 1),
        ideal_kisht_mool:
          ((formData.installmentPlan.avshesh_dhanrashi || 0) /
            (formData.installmentPlan.ideal_number_of_installments || 1)),
        ideal_kisht_byaj:
          (((formData.installmentPlan.avshesh_dhanrashi || 0) * (formData.installmentPlan.interest_rate || 0) / 100) /
            (formData.installmentPlan.ideal_number_of_installments || 1)),
        late_fee_per_day: 643.0, // Assuming a default value as per cURL
      },
      installments: [], // Simplified: Add logic to generate installments if needed
      serviceCharges: [], // Simplified: Add logic to add service charges if needed
    };

    try {
      const response = await fetch(BASE_URL+"/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQURNSU4tMTc0MjU0MTQ0MzQwOCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MjU0ODIyMiwiZXhwIjoxNzQyNTUxODIyfQ.p6D2houIQAP_Sp18TWAx9X3c2Aj6WkZnKAIgUy4l9u8",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Property added successfully:", await response.json());
        setIsSubmitting(false);
        onClose();
      } else {
        console.error("Failed to add property:", response.statusText);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const sectionMap: { [key: number]: string } = {
    0: "propertyRecord",
    1: "propertyRecord",
    2: "propertyRecord",
    3: "installmentPlan",
    4: "propertyRecord",
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Steps indicator */}
          <div className="flex justify-center mb-8">
            {formSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center relative mx-4"
                onClick={() => setCurrentStep(index)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 border-2",
                    currentStep === index
                      ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                      : index < currentStep
                      ? "bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-400"
                      : "bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                  )}
                >
                  {index + 1}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {step.title}
                </div>
                {index < formSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-20 h-0.5 mx-2 mt-4",
                      index < currentStep ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700",
                      "transition-all duration-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto px-2 mt-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {formSteps[currentStep].fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                        onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                        value={formData[sectionMap[currentStep]][field.id] || ""}
                      >
                        <option value="" className="dark:bg-gray-800">
                          Select option...
                        </option>
                        {field.options?.map((option) => (
                          <option key={option} value={option} className="dark:bg-gray-800">
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[sectionMap[currentStep]][field.id] || ""}
                        onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                      />
                    ) : field.type === "boolean" ? (
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                        onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                        value={formData[sectionMap[currentStep]][field.id] || ""}
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
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[sectionMap[currentStep]][field.id] || ""}
                        onChange={(e) => handleInputChange(sectionMap[currentStep], field.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
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
                  {isSubmitting ? "Submitting..." : "Submit"}
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
  );
}