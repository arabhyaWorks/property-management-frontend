import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../data/endpoint";
import ServiceChargeStep from "../components/propertyCreation/serviceChargeStep";
import formSteps from "../data/formSteps";

const sectionMap = {
  0: "propertyRecord", // Step 0: Allottee Details
  1: "propertyRecordDetail", // Step 1: Property Details
  2: "propertyRecordDetail", // Step 2: Registration Details
  3: "propertyRecordDetail", // Step 3: Installment Plan
  4: "installments", // Step 4: Payment Installment Details
  5: "propertyRecordDetail", // Step 5: Installment Plan Summary
  6: "serviceCharges", // Step 6: Service Charges
};

const nonEditableFields = [
  "id",
  "property_id",
  "sampatti_sreni",
  "avanti_sampatti_sankhya",
  "panjikaran_dhanrashi",
  "panjikaran_dinank",
  "avantan_dhanrashi",
  "avantan_dinank",
  "vikray_mulya",
  "auction_keemat",
  "avshesh_vikray_mulya_ekmusht_jama_dhanrashi",
  "avshesh_vikray_mulya_ekmusht_jama_dinank",
  "ekmusht_jama_dhanrashi",
  "kshetrafal",
  "property_floor_type",
  "avshesh_dhanrashi",
  "interest_rate",
  "time_period",
  "total_interest_amount",
  "total_interest_amount_div_2",
  "kul_yog",
  "ideal_number_of_installments",
  "ideal_installment_amount_per_installment",
  "ideal_kisht_mool",
  "ideal_kisht_byaj",
  "late_fee_per_day",
  "first_installment_due_date",
];

export default function EditProperty() {
  const { property_id } = useParams();
  const [formData, setFormData] = useState(null); // Null until data is fetched
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentForm, setPaymentForm] = useState({
    /* Same as CreateNewProperty */
  });

  // Utility to convert dd-mm-yyyy to yyyy-mm-dd
  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  // Utility to convert yyyy-mm-dd to dd-mm-yyyy (reused from CreateNewProperty)
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${BASE_URL}/properties/${property_id}`);
        if (!response.ok) throw new Error("Failed to fetch property");
        const data = await response.json();

        const propertyRecord = {
          ...data.propertyRecords[0],
          kabja_dinank: formatDateToYYYYMMDD(
            data.propertyRecords[0].kabja_dinank
          ),
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
        };

        const formInstallments = {
          installment_amount: "1230737.25",
          interest_amount: "73844.24",
          late_fee: "0.00",
          payment_date: "2020-01-01",
          payment_number: 1,
          due_date: "2020-02-01",
        };
        const recordInstallments = {
          payment_id: "PAY-20250419141804-000",
          property_id: "BID-20250419141804",
          property_record_id: 905,

          user_id: 1,
          user_role: "allottee",
          user_name: "R Arabhaya",
          status: "paid",
          payment_amount: "1304581.49",
          total_payment_amount_with_late_fee: "1305224.85",

          payment_number: 1,
          kisht_mool_paid: "1230737.25", //installment_amount
          kisht_byaj_paid: "73844.24", //interest_amount
          payment_due_date: "01-02-2020", //due_date
          payment_date: "02-02-2020",
          late_fee_amount: "643.36",
          number_of_days_delayed: 1,
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
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };
    fetchProperty();
  }, [property_id]);

  // Loading state
  if (!formData) {
    return <div className="text-center py-10">Loading property data...</div>;
  }

  // Handle input change (same as CreateNewProperty, reused)
  const handleChange = (section, fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldId]: value,
      },
    }));
  };

  // Handle adding payment (reused from CreateNewProperty with minor adjustment)
  const handleAddPayment = () => {
    const dueDate = new Date(
      formData.propertyRecordDetail.first_installment_due_date
    );
    dueDate.setMonth(dueDate.getMonth() + formData.installments.length * 3); // Assuming quarterly

    const newPayment = {
      payment_number: formData.installments.length + 1,
      payment_due_date: dueDate.toISOString().split("T")[0],
      payment_amount: paymentForm.payment_amount,
      payment_date: paymentForm.payment_date,
      payment_status: paymentForm.payment_status,
    };

    setFormData((prev) => ({
      ...prev,
      installments: [...prev.installments, newPayment],
    }));
    setPaymentForm({
      /* Reset payment form as in CreateNewProperty */
    });
  };

  // Handle submit with PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== formSteps.length - 1) return;

    const payload = {
      propertyRecords: [
        {
          ...formData.propertyRecord,
          kabja_dinank: formatDateToDDMMYYYY(
            formData.propertyRecord.kabja_dinank
          ),
        },
      ],
      propertyRecordDetail: {
        ...formData.propertyRecordDetail,
        panjikaran_dinank: formatDateToDDMMYYYY(
          formData.propertyRecordDetail.panjikaran_dinank
        ),
        avantan_dinank: formatDateToDDMMYYYY(
          formData.propertyRecordDetail.avantan_dinank
        ),
        first_installment_due_date: formatDateToDDMMYYYY(
          formData.propertyRecordDetail.first_installment_due_date
        ),
      },
      installments: formData.installments.map((inst) => ({
        ...inst,
        payment_due_date: formatDateToDDMMYYYY(inst.payment_due_date),
        payment_date: formatDateToDDMMYYYY(inst.payment_date),
      })),
      serviceCharges: formData.serviceCharges.map((charge) => ({
        ...charge,
        service_charge_payment_date: formatDateToDDMMYYYY(
          charge.service_charge_payment_date
        ),
      })),
    };

    try {
      const response = await fetch(`${BASE_URL}/properties/${property_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update property");
      alert("Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  // Render UI (mostly reused from CreateNewProperty)
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <div className="flex mb-6">
        {formSteps.map((step, index) => (
          <button
            key={index}
            className={`flex-1 py-2 ${
              currentStep === index ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentStep(index)}
          >
            {step.title}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {currentStep === 4 ? (
          // Installments Step (reused with existing data)
          <div>
            <h2 className="text-xl font-semibold mb-4">Installments</h2>
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {formData.installments.map((inst, index) => (
                  <tr key={index}>
                    <td>{inst.payment_number}</td>
                    <td>{inst.payment_due_date}</td>
                    <td>{inst.payment_amount}</td>
                    <td>{inst.payment_date || "N/A"}</td>
                    <td>{inst.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Add Payment Form - reused */}
            <button
              onClick={handleAddPayment}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Payment
            </button>
          </div>
        ) : currentStep === 6 ? (
          <ServiceChargeStep formData={formData} setFormData={setFormData} />
        ) : (
          formSteps[currentStep].fields.map((field) => {
            const section = sectionMap[currentStep];
            const fieldValue = formData[section][field.id] || "";
            const isReadOnly =
              nonEditableFields.includes(field.id) || field.readOnly;

            return (
              <div key={field.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                  {field.required && !isReadOnly && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {isReadOnly ? (
                  <input
                    type={field.type}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 cursor-not-allowed"
                    value={fieldValue}
                    disabled
                  />
                ) : field.type === "select" ? (
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    value={fieldValue}
                    onChange={(e) =>
                      handleChange(section, field.id, e.target.value)
                    }
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    value={fieldValue}
                    onChange={(e) =>
                      handleChange(section, field.id, e.target.value)
                    }
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        {currentStep === formSteps.length - 1 ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Update Property
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentStep((prev) => prev + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
