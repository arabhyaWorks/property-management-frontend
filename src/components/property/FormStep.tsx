import React from "react";
import { FieldRenderer } from "./FieldRenderer";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "boolean" | "file";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
  accept?: string;
}

interface FormStepProps {
  step: { title: string; fields: FormField[] };
  section: string;
  formData: any;
  handleInputChange: (section: string, fieldId: string, value: any) => void;
  errors: { [key: string]: string };
  yojnas: any[];
  financialYearOptions: string[];
  maxDate?: string;
}

export const FormStep: React.FC<FormStepProps> = ({
  step,
  section,
  formData,
  handleInputChange,
  errors,
  yojnas,
  financialYearOptions,
  maxDate,
}) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
          {step.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Fill in the details for {step.title.toLowerCase()}.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {step.fields.map((field) => {
          const optionsData =
            field.id === "yojna_id"
              ? yojnas.map((y) => ({ value: y.yojna_id, label: y.yojna_name }))
              : field.id === "service_charge_financial_year"
              ? financialYearOptions.map((opt) => ({ value: opt, label: opt }))
              : undefined;

          return (
            <FieldRenderer
              key={field.id}
              field={field}
              value={
                section === "paymentInstallments"
                  ? formData[field.id] || ""
                  : formData[section][field.id] || ""
              }
              onChange={(fieldId, value) =>
                handleInputChange(section, fieldId, value)
              }
              error={errors[field.id]}
              optionsData={optionsData}
              maxDate={maxDate}
            />
          );
        })}
      </div>
    </div>
  );
};
