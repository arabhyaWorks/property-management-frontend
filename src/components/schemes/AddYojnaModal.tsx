import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import BASE_URL from "../../data/endpoint";

interface AddYojnaModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddYojnaModal({ onClose, onSuccess }: AddYojnaModalProps) {
  const [formData, setFormData] = useState({
    yojna_id: "",
    yojna_name: "",
    interest_rate: "",
    time_period: 1,
    number_of_installments: 4,
    installment_frequency: "quarterly", // Added to match API
    sampatti_sreni_list: [""],
  });

  const addPropertyCategory = () => {
    if (formData.sampatti_sreni_list.length < 10) {
      setFormData((prev) => ({
        ...prev,
        sampatti_sreni_list: [...prev.sampatti_sreni_list, ""],
      }));
    } else {
      toast.error("Maximum 10 property categories allowed");
    }
  };

  const removePropertyCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sampatti_sreni_list: prev.sampatti_sreni_list.filter((_, i) => i !== index),
    }));
  };

  const updatePropertyCategory = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sampatti_sreni_list: prev.sampatti_sreni_list.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken") || "<auth-token>"; // Replace with your token retrieval logic
      const response = await fetch(`${BASE_URL}/api/yojna`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          interest_rate: parseFloat(formData.interest_rate), // Ensure numeric value
          time_period: parseInt(formData.time_period), // Ensure integer
          number_of_installments: parseInt(formData.number_of_installments), // Ensure integer
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create yojna");
      }

      const data = await response.json();
      toast.success(data.message || "Yojna created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating yojna:", error);
      toast.error("Failed to create yojna");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">नई योजना जोड़ें</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                योजना आईडी
              </label>
              <input
                type="text"
                value={formData.yojna_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, yojna_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                योजना का नाम
              </label>
              <input
                type="text"
                value={formData.yojna_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, yojna_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Categories (संपत्ति श्रेणी)
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.sampatti_sreni_list.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => updatePropertyCategory(index, e.target.value)}
                      placeholder="e.g., HIG-1"
                      className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    {formData.sampatti_sreni_list.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePropertyCategory(index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formData.sampatti_sreni_list.length < 10 && (
                <button
                  type="button"
                  onClick={addPropertyCategory}
                  className="flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Plus className="h-4 w-4" />
                  और श्रेणी जोड़ें
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ब्याज दर (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.interest_rate}
                onChange={(e) => setFormData((prev) => ({ ...prev, interest_rate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                समय अवधि (वर्ष)
              </label>
              <input
                type="number"
                value={formData.time_period}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time_period: parseInt(e.target.value) }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                किश्तों की संख्या
              </label>
              <input
                type="number"
                value={formData.number_of_installments}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    number_of_installments: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Installment Frequency (किश्त की आवृत्ति)
              </label>
              <select
                value={formData.installment_frequency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, installment_frequency: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              योजना बनाएं
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}