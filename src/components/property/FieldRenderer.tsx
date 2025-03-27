import React from "react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "boolean" | "file";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
  accept?: string;
}

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error?: string;
  optionsData?: { value: string; label: string }[];
  maxDate?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  optionsData,
  maxDate,
}) => {
  const commonClasses =
    "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm shadow-sm";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && (
          <span className="text-red-500 dark:text-red-400 ml-1">*</span>
        )}
      </label>
      {field.readOnly ? (
        <input
          type={field.type}
          className={`${commonClasses} bg-gray-100 cursor-not-allowed`}
          value={value || ""}
          disabled
        />
      ) : field.type === "select" ? (
        <select
          className={commonClasses}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          <option value="" className="dark:bg-gray-800">
            Select option...
          </option>
          {(optionsData || field.options)?.map((opt, idx) => (
            <option
              key={typeof opt === "string" ? opt : opt.value}
              value={typeof opt === "string" ? opt : opt.value}
              className="dark:bg-gray-800"
            >
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          className={`${commonClasses} min-h-24`}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      ) : field.type === "boolean" ? (
        <select
          className={commonClasses}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
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
      ) : field.type === "file" ? (
        <input
          type="file"
          accept={field.accept}
          className={commonClasses}
          onChange={(e) =>
            onChange(field.id, e.target.files ? e.target.files[0] : null)
          }
        />
      ) : field.type === "date" ? (
        <input
          type="date"
          className={commonClasses}
          value={value || ""}
          max={maxDate}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      ) : (
        <input
          type={field.type}
          className={commonClasses}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};