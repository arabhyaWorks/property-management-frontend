import React, { createContext, useContext, useState } from "react";

type ServiceChargeContextType = {
  serviceChargeResult: ServiceChargeResult | null;
  updateServiceCharge: (propertyCategory: string, financialYear: string) => void;
};

const ServiceChargeContext = createContext<ServiceChargeContextType | undefined>(undefined);

export const ServiceChargeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [serviceChargeResult, setServiceChargeResult] = useState<ServiceChargeResult | null>(null);

  const updateServiceCharge = (propertyCategory: string, financialYear: string) => {
    const serviceCharge = propertyCategory === "LGF" ? 10610 : propertyCategory === "HGF" ? 11005 : 0;

    if (!serviceCharge) {
      return setServiceChargeResult({ error: "Invalid property category" });
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentFinancialYear =
      currentDate.getMonth() < 3 ? `${currentYear - 1}-${currentYear}` : `${currentYear}-${currentYear + 1}`;

    const selectedYear = parseInt(financialYear.split("-")[0]);
    const offset = parseInt(currentFinancialYear.split("-")[0]) - selectedYear;

    let totalCharge = serviceCharge;
    let lateFee = 0;

    switch (offset) {
      case 0:
        lateFee = 0;
        break;
      case 1:
        lateFee = (5 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 2:
        lateFee = (10 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 3:
        lateFee = (15 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 4:
        lateFee = (20 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 5:
        lateFee = (25 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      case 6:
        lateFee = (30 / 100) * serviceCharge;
        totalCharge += lateFee;
        break;
      default:
        if (offset > 6) {
          return setServiceChargeResult({
            error: "Calculations for financial years beyond the last 6 are not supported.",
          });
        }
        break;
    }

    setServiceChargeResult({
      propertyCategory,
      financialYear,
      serviceCharge: Math.ceil(serviceCharge),
      lateFee: Math.ceil(lateFee),
      totalCharge: Math.ceil(totalCharge),
      isCurrentYear: offset === 0,
    });
  };

  return (
    <ServiceChargeContext.Provider value={{ serviceChargeResult, updateServiceCharge }}>
      {children}
    </ServiceChargeContext.Provider>
  );
};

export const useServiceCharge = () => {
  const context = useContext(ServiceChargeContext);
  if (!context) {
    throw new Error("useServiceCharge must be used within a ServiceChargeProvider");
  }
  return context;
};
 