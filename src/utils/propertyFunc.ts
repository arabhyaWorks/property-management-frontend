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

// (Optional) Aadhaar & mobile validations
const validateAadhaarNumber = (value: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(value);
};

const validateMobileNumber = (value: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(value);
};
