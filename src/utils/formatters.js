/**
 * Format a number as currency (INR)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    
    // Convert to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Format as Indian Rupees
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };
  
  /**
   * Format a date string to a readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString || dateString.includes('1899')) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  /**
   * Format a financial year string for better display
   * @param {string} fyString - Financial year string (e.g., "2023-2024")
   * @returns {string} Formatted financial year string
   */
  export const formatFinancialYear = (fyString) => {
    if (!fyString) return '';
    
    const [startYear, endYear] = fyString.split('-');
    return `FY ${startYear}-${endYear}`;
  };