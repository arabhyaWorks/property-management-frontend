export interface Scheme {
  id: string;
  name: string;
  type: 'HOUSING' | 'COMMERCIAL';
  category: 'OLD' | 'NEW';
  totalPlots: number;
  allottedPlots: number;
  paymentType: 'FREEHOLD' | 'RENTAL' | 'EMI';
  pendingPayment: number;
}

export interface Stats {
  totalSchemes: number;
  newSchemes: number;
  oldSchemes: number;
  totalPlots: number;
  rentalPlots: number;
  freeholdPlots: number;
  pendingPaymentThisMonth: number;
  totalLatePayment: number;
}