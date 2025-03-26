export interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'MIXED';
  category: string;
  categoryHindi: string;
  totalPlots?: number;
  occupiedPlots?: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface SchemeCategory {
  title: string;
  titleHindi: string;
  schemes: Scheme[];
}