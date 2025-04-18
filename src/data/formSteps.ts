interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "boolean" | "file";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
  accept?: string;
  maxSize?: number;
}
// Form Structures
interface FormStep {
  title: string;
  fields: FormField[];
}

const formSteps: FormStep[] = [
  {
    title: "मूलभूत जानकारी",
    fields: [
      {
        id: "yojna_id",
        label: "योजना का नाम",
        type: "select",
        options: [],
        required: true,
      },
      {
        id: "avanti_ka_naam",
        label: "आवंटी का नाम",
        type: "text",
        required: true,
      },
      {
        id: "pita_pati_ka_naam",
        label: "पिता/पति का नाम",
        type: "text",
        required: true,
      },
      {
        id: "avanti_ka_sthayi_pata",
        label: "आवंटी का स्थायी पता",
        type: "textarea",
        required: true,
      },
      {
        id: "avanti_ka_vartaman_pata",
        label: "आवंटी का वर्तमान पता",
        type: "textarea",
        required: true,
      },
      { id: "mobile_no", label: "मोबाइल नंबर", type: "text", required: false },
      { id: "aadhar_number", label: "आधार नंबर", type: "text" },
      {
        id: "aadhar_photo",
        label: "आधार फोटो (अधिकतम आकार 200kb)",
        type: "file",
        accept: "image/*",
        maxSize: 200 * 1024,
      },
      {
        id: "documents",
        label: "दस्तावेज़ (केवल PDF)",
        type: "file",
        accept: "application/pdf",
      },
    ],
  },
  {
    title: "संपत्ति विवरण",
    fields: [
      {
        id: "sampatti_sreni",
        label: "संपत्ति श्रेणी",
        type: "select",
        options: [],
        required: true,
      },
      {
        id: "avanti_sampatti_sankhya",
        label: "संपत्ति संख्या",
        type: "text",
        required: true,
      },
      {
        id: "property_floor_type",
        label: "फ्लोर प्रकार",
        type: "select",
        options: ["UGF", "LGF", "First Floor", "Second Floor"],
        required: true,
      },
      { id: "kshetrafal", label: "क्षेत्रफल (वर्ग मीटर)", type: "number" },
      { id: "kabja_dinank", label: "कब्जा दिनांक", type: "date" },
      { id: "bhavan_nirman", label: "भवन निर्माण", type: "boolean" },
    ],
  },
  {
    title: "वित्तीय जानकारी",
    fields: [
      {
        id: "panjikaran_dhanrashi",
        label: "पंजीकरण धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "avantan_dhanrashi",
        label: "आवंटन धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "vikray_mulya",
        label: "विक्रय शुल्क",
        type: "number",
        required: true,
      },
      {
        id: "panjikaran_dinank",
        label: "पंजीकरण दिनांक",
        type: "date",
        required: true,
      },
      {
        id: "avantan_dinank",
        label: "आवंटन दिनांक",
        type: "date",
        required: true,
      },
      { id: "auction_keemat", label: "नीलामी शुल्क", type: "number" },
      { id: "avshesh_vikray_mulya_ekmusht_jama_dhanrashi", label: "अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि", type: "number" },
      { id: "ekmusht_jama_dhanrashi", label: "एकमुश्त जमा धनराशि पर छूट", type: "number" },
      { id: "avshesh_vikray_mulya_ekmusht_jama_dinank", label: "अवशेष विक्रय मूल्य एकमुश्त जमा दिनांक", type: "date" },
      { id: "lease_rent_dhanrashi", label: "लीज रेंट धनराशि", type: "number" },
      { id: "free_hold_dhanrashi", label: "फ्री होल्ड धनराशि", type: "number" },
    ],
  },
  {
    title: "किस्त योजना",
    fields: [
      {
        id: "interest_rate",
        label: "ब्याज दर (%)",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "time_period",
        label: "समय अवधि (वर्ष)",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "ideal_number_of_installments",
        label: "किस्तों की संख्या",
        type: "number",
        required: true,
        readOnly: true,
      },
    ],
  },
  {
    title: "भुगतान किश्त विवरण",
    fields: [
      {
        id: "installment_amount",
        label: "किस्त जमा धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "interest_amount",
        label: "किस्त जमा ब्याज धनराशि",
        type: "number",
        required: true,
      },
      {
        id: "late_fee",
        label: "विलंब ब्याज धनराशि",
        type: "number",
        required: true,
        readOnly: false,
      },
      { id: "payment_date", label: "दिनांक", type: "date", required: true },
    ],
  },
  {
    title: "अतिरिक्त शुल्क और विवरण",
    fields: [
      { id: "park_charge", label: "पार्क चार्ज", type: "number" },
      { id: "corner_charge", label: "कॉर्नर शुल्क", type: "number" },
      {
        id: "atirikt_bhoomi_ki_dhanrashi",
        label: "अतिरिक्त भूमि की धनराशि",
        type: "number",
      },
      { id: "punarjivit_shulk", label: "पुनर्जीवित शुल्क", type: "number" },
      { id: "praman_patra_shulk", label: "प्रमाण पत्र शुल्क", type: "number" },
      { id: "vigyapan_shulk", label: "विज्ञापन शुल्क", type: "number" },
    //   { id: "nibandhan_shulk", label: "निबंधन शुल्क", type: "number" },
    //   { id: "nibandhan_dinank", label: "निबंधन दिनांक", type: "date" },
      { id: "labansh", label: "लाभांश", type: "text" },
      { id: "anya", label: "अन्य टिप्पणी", type: "textarea" },
    ],
  },
  {
    title: "सेवा शुल्क विवरण",
    fields: [
      {
        id: "service_charge_financial_year",
        label: "वित्तीय वर्ष",
        type: "select",
        options: [],
        required: true,
      },
      {
        id: "service_charge_amount",
        label: "सेवा शुल्क राशि",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "service_charge_late_fee",
        label: "सेवा शुल्क विलंब शुल्क",
        type: "number",
        required: true,
        readOnly: true,
      },
      {
        id: "service_charge_payment_date",
        label: "सेवा शुल्क भुगतान तिथि",
        type: "date",
        required: true,
      },
    ],
  },
];

export default formSteps;
