export const formatIndianNumber = (num: number): string => {
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

export const calculateNextDueDate = (startDate: string): string => {
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

export const calculateLateFee = (
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

export const getFinancialYearFromDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();
  return month < 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
};

export const generateFinancialYearOptions = (
  allotmentDate: string
): string[] => {
  const allotmentFY = getFinancialYearFromDate(allotmentDate);
  const [startYear] = allotmentFY.split("-").map(Number);
  const options: string[] = [];
  for (let year = startYear; year <= 2025; year++) {
    options.push(`${year}-${year + 1}`);
  }
  return options;
};

export const calculateServiceChargeLateFee = (
  allotmentFY: string,
  selectedFY: string,
  paymentDate: string,
  serviceChargeAmount: number
): number => {
  if (!allotmentFY || !selectedFY || !paymentDate) return 0;
  const [selectedStartYear] = selectedFY.split("-").map(Number);
  const dueDate = new Date(`${selectedStartYear + 1}-03-31`);
  const payment = new Date(paymentDate);
  if (payment <= dueDate) return 0;
  const currentDate = new Date("2025-03-23");
  const yearsDelayed = currentDate.getFullYear() - (selectedStartYear + 1);
  if (yearsDelayed <= 0) return 0;
  if (yearsDelayed === 1) return serviceChargeAmount * 0.05;
  if (yearsDelayed === 2) return serviceChargeAmount * 0.1;
  if (yearsDelayed >= 3) return serviceChargeAmount * 0.15;
  return 0;
};

export const formatDateToDDMMYYYY = (dateString: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const validateAadhaarNumber = (value: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(value);
};

export const validateMobileNumber = (value: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(value);
};
