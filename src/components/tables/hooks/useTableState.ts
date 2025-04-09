import { useState } from 'react';
import { PropertyRecord } from '../../../types';

export interface Column {
  key: keyof PropertyRecord;
  label: string;
  visible: boolean;
  sortable?: boolean;
}

export interface SortConfig {
  key: keyof PropertyRecord | null;
  direction: 'asc' | 'desc';
}

export const propertyColumns = [
  { key: "property_unique_id", label: "Property Unique ID", visible: true, sortable: true },
  { key: "yojna_id", label: "Yojna ID", visible: true, sortable: true },
  { key: "user_id", label: "User ID", visible: true, sortable: true },
  { key: "avanti_ka_naam", label: "आवंटी का नाम", visible: true, sortable: true },
  { key: "pita_pati_ka_naam", label: "पिता/पति का नाम", visible: true, sortable: true },
  { key: "avanti_ka_sthayi_pata", label: "आवंटी का स्थायी पता", visible: true, sortable: true },
  { key: "avanti_ka_vartaman_pata", label: "आवंटी का वर्तमान पता", visible: true, sortable: true },
  { key: "mobile_no", label: "Mobile No", visible: true, sortable: true },
  { key: "sampatti_sreni", label: "संपत्ति श्रेणी", visible: true, sortable: true },
  { key: "avanti_sampatti_sankhya", label: "आवंटी संपत्ति संख्या", visible: true, sortable: true },
  { key: "panjikaran_dhanrashi", label: "पंजीकरण धनराशि", visible: true, sortable: true },
  { key: "panjikaran_dinank", label: "पंजीकरण दिनांक", visible: true, sortable: true },
  { key: "avantan_dhanrashi", label: "आवंटन धनराशि", visible: true, sortable: true },
  { key: "avantan_dinank", label: "आवंटन दिनांक", visible: true, sortable: true },
  { key: "vikray_mulya", label: "विक्रय धनराशि", visible: true, sortable: true },
  { key: "free_hold_dhanrashi", label: "फ्री होल्ड धनराशि", visible: true, sortable: true },
  { key: "auction_keemat", label: "Auction कीमत", visible: true, sortable: true },
  { key: "lease_rent_dhanrashi", label: "Lease Rent धनराशि", visible: true, sortable: true },
  { key: "park_charge", label: "Park Charge", visible: true, sortable: true },
  { key: "corner_charge", label: "Corner Charge", visible: true, sortable: true },
  { key: "avshesh_vikray_mulya_ekmusht_jama_dhanrashi", label: "अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि", visible: true, sortable: true },
  { key: "avshesh_vikray_mulya_ekmusht_jama_dinank", label: "अवशेष विक्रय मूल्य एकमुश्त जमा दिनांक", visible: true, sortable: true },
  { key: "ekmusht_jama_dhanrashi", label: "एकमुश्त जमा धनराशि", visible: true, sortable: true },
  { key: "byaj_dhanrashi", label: "ब्याज धनराशि", visible: true, sortable: true },
  { key: "dinank", label: "दिनांक", visible: true, sortable: true },
  { key: "kshetrafal", label: "क्षेत्रफल", visible: true, sortable: true },
  { key: "kabja_dinank", label: "कब्जा दिनांक", visible: true, sortable: true },
  { key: "atirikt_bhoomi_ki_dhanrashi", label: "अतिरिक्त भूमि की धनराशि", visible: true, sortable: true },
  { key: "punarjivit_shulk", label: "पुनर्जीवित शुल्क", visible: true, sortable: true },
  { key: "praman_patra_shulk", label: "प्रमाण पत्र शुल्क", visible: true, sortable: true },
  { key: "vigyapan_shulk", label: "विज्ञापन शुल्क", visible: true, sortable: true },
  { key: "nibandhan_shulk", label: "निबंधन शुल्क", visible: true, sortable: true },
  { key: "nibandhan_dinank", label: "निबंधन दिनांक", visible: true, sortable: true },
  { key: "patta_bhilekh_dinank", label: "पट्टा भिलेख दिनांक", visible: true, sortable: true },
  { key: "namantri_ka_naam", label: "नामंत्री का नाम", visible: true, sortable: true },
  { key: "namantri_ke_pita_pati_ka_naam", label: "नामंत्री के पिता/पति का नाम", visible: true, sortable: true },
  { key: "namantri_ka_pata", label: "नामंत्री का पता", visible: true, sortable: true },
  { key: "namantaran_shulk", label: "नामांतरण शुल्क", visible: true, sortable: true },
  { key: "namantaran_dinank", label: "नामांतरण दिनांक", visible: true, sortable: true },
  { key: "documentation_shulk", label: "Documentation शुल्क", visible: true, sortable: true },
  { key: "varasat", label: "वारसत", visible: true, sortable: true },
  { key: "bhavan_manchitra_swikrit_manchitra", label: "भवन मानचित्र स्वीकृत मानचित्र", visible: true, sortable: true },
  { key: "bhavan_nirman", label: "भवन निर्माण", visible: true, sortable: true },
  { key: "jama_dhan_rashi_dinank", label: "जमा धन राशि दिनांक", visible: true, sortable: true },
  { key: "jama_dhan_rashid_sankhya", label: "जमा धन राशि संख्या", visible: true, sortable: true },
  { key: "sewer_connection_water_connection_charge", label: "Sewer/Water Connection Charge", visible: true, sortable: true },
  { key: "labansh", label: "लाभांश", visible: true, sortable: true },
  { key: "anya", label: "अन्य", visible: true, sortable: true },
  { key: "abhiyookti", label: "अभियुक्ति", visible: true, sortable: true },
  { key: "property_floor_type", label: "Property Floor Type", visible: true, sortable: true },
  { key: "aadhar_number", label: "Aadhar Number", visible: true, sortable: true },
  { key: "aadhar_photo_link", label: "Aadhar Photo Link", visible: true, sortable: true },
  { key: "documents_link", label: "Documents Link", visible: true, sortable: true },
];

export function useTableState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState<Column[]>(propertyColumns);

  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: null, 
    direction: 'asc' 
  });

  const toggleColumnVisibility = (key: keyof PropertyRecord) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSort = (key: keyof PropertyRecord) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    showColumnSelector,
    setShowColumnSelector,
    showFilters,
    setShowFilters,
    columns,
    setColumns,
    sortConfig,
    setSortConfig,
    toggleColumnVisibility,
    handleSort
  };
}
