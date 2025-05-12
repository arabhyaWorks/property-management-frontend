import React, { useState, useEffect } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import BASE_URL from "../data/endpoint";
import PropertyExportPDF from "../components/PropertyExportPDF";
import ComingSoonModal from "../alottee/components/ComingSoonModal";

const formatDateToDDMMYYYY = (dateString: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

interface TransferFormData {
  yojna_id: string;
  property_id: string;
  transfer_type: "namantaran" | "varasat";
  from_user_id: number;
  relationship: string | null;
  avanti_ka_naam: string;
  pita_pati_ka_naam: string;
  avanti_ka_sthayi_pata: string;
  avanti_ka_vartaman_pata: string;
  mobile_no: string;
  kabja_dinank: string;
  transfer_date: string;
  documentation_shulk?: number;
  mutation_charges?: number;
  advertisement_charges?: number;
  miscellaneous_charges?: number;
  aadhar_number: string;
  aadhar_photo_link: string;
  bainama_abhilekh?: string;
  ketra_sapath_patra: string;
  ketra_undertaking?: string;
  vikreta_sapath_patra?: string;
  mitriyu_praman_patra?: string;
  nikat_sambandhi_praman_patra?: string;
  pan_card: string;
  documents_link: string;
  abhiyookti: string;
}

export function PropertyDetail() {
  const { property_id } = useParams();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"namantaran" | "varasat">(
    "namantaran"
  );
  const [formData, setFormData] = useState<TransferFormData>({
    transfer_type: "namantaran",
    from_user_id: 1,
    relationship: null,
    avanti_ka_naam: "",
    pita_pati_ka_naam: "",
    avanti_ka_sthayi_pata: "",
    avanti_ka_vartaman_pata: "",
    mobile_no: "",
    kabja_dinank: "",
    transfer_date: new Date().toISOString().split("T")[0],
    documentation_shulk: 0,
    mutation_charges: 0,
    advertisement_charges: 0,
    miscellaneous_charges: 0,
    aadhar_number: "",
    aadhar_photo_link: "",
    bainama_abhilekh: "",
    ketra_sapath_patra: "",
    ketra_undertaking: "",
    vikreta_sapath_patra: "",
    mitriyu_praman_patra: "",
    nikat_sambandhi_praman_patra: "",
    pan_card: "",
    documents_link: "",
    abhiyookti: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/properties/${property_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();
        console.log("Property Data:", data);
        setPropertyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property_id]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof TransferFormData,
    maxSize: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    // Prepare form data for upload
    const uploadData = new FormData();
    uploadData.append("file", file);

    setUploading(true);
    try {
      const response = await fetch("http://localhost:3000/api/file-upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [field]: result.fileUrl,
        }));
        toast.success("File uploaded successfully");
      } else {
        throw new Error(result.message || "File upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("File upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleTransfer = async () => {
    const payload = {
      ...formData,
      yojna_id: propertyData.propertyRecords[0].yojna_id,
      property_id,
    };

    try {
      const response = await fetch(`${BASE_URL}/properties/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Transfer failed");
      }

      toast.success("Property transferred successfully");
      setIsTransferModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to transfer property");
      console.error("Transfer error:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-blue-600 font-semibold text-xl">
            Loading...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
            <p className="text-red-500 font-medium">Error: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!propertyData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-blue-200 border border-blue-200 rounded-lg p-6 shadow-md">
            <p className="text-blue-600 font-medium">No data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentOwner =
    propertyData.propertyRecords[propertyData.propertyRecords.length - 1];
  const ownershipHistory = [...propertyData.propertyRecords].reverse();

  const handleEdit = () => {
    navigate(`/edit-property/${property_id}`);
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 relative flex justify-between">
          <div>
            <h1 className="text-2xl text-white font-bold mb-2">
              योजना: {propertyData.propertyRecords[0].yojna_name}
            </h1>
            <p className="text-white">
              <span className="font-semibold">संपत्ति श्रेणी</span> -
              {propertyData.propertyRecordDetail.sampatti_sreni}
              <span className="font-semibold">, संपत्ति संख्या:</span>{" "}
              {propertyData.propertyRecordDetail.avanti_sampatti_sankhya}
            </p>
          </div>
          <div className="flex justify-between items-start">
            <button
              onClick={() => handleEdit()}
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              aria-label="Edit property"
            >
              <Pencil />
            </button>

            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-full p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              aria-label="Transfer property"
            >
              <Plus />
            </button>

            <PropertyExportPDF
              propertyData={propertyData}
              propertyId={property_id}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">
              वर्तमान आवंटी का विवरण
            </h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">आवंटी का नाम:</span>{" "}
                  {currentOwner.avanti_ka_naam}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    पिता/पति का नाम:
                  </span>{" "}
                  {currentOwner.pita_pati_ka_naam}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">स्थायी पता:</span>{" "}
                  {currentOwner.avanti_ka_sthayi_pata}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">वर्तमान पता:</span>{" "}
                  {currentOwner.avanti_ka_vartaman_pata}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">मोबाइल नंबर:</span>{" "}
                  {currentOwner.mobile_no}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">आधार नंबर:</span>{" "}
                  {currentOwner.aadhar_number}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">आधार फोटो:</span>{" "}
                  <a
                    href={currentOwner.aadhar_photo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    देखें
                  </a>
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">दस्तावेज:</span>{" "}
                  <a
                    href={currentOwner.documents_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    देखें
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">
              संपत्ति विवरण
            </h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    संपत्ति संख्या:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.property_id}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    संपत्ति श्रेणी:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.sampatti_sreni}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    आवंटी संपत्ति संख्या:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.avanti_sampatti_sankhya}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    संपत्ति मंजिल प्रकार:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.property_floor_type}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">क्षेत्रफल:</span>{" "}
                  {propertyData.propertyRecordDetail.kshetrafal ||
                    "उपलब्ध नहीं"}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">कब्जा दिनांक:</span>{" "}
                  {currentOwner.kabja_dinank || "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  {/* <span className="font-semibold min-w-40">कब्जा दिनांक:</span>{" "} */}
                  <span className="font-semibold min-w-40">
                    {propertyData.propertyRecords[
                      propertyData.propertyRecords.length - 2
                    ].transfer_type === "namantaran"
                      ? "नामांतरण "
                      : "वरासत "}
                    दिनांक:
                  </span>{" "}
                  {/* {propertyData.transfer_date ||
                    "उपलब्ध नहीं"} */}
                  {propertyData.propertyRecords[
                    propertyData.propertyRecords.length - 2
                  ].transfer_date
                    ? formatDateToDDMMYYYY(
                        propertyData.propertyRecords[
                          propertyData.propertyRecords.length - 2
                        ].transfer_date
                      )
                    : "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">भवन निर्माण:</span>{" "}
                  {propertyData.propertyRecordDetail.bhavan_nirman}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    भवन मानचित्र स्वीकृत:
                  </span>{" "}
                  {propertyData.propertyRecordDetail
                    .bhavan_manchitra_swikrit_manchitra || "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">लाभांश:</span>{" "}
                  {propertyData.propertyRecordDetail.labansh}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">अन्य:</span>{" "}
                  {propertyData.propertyRecordDetail.anya}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">
              वित्तीय विवरण
            </h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    पंजीकरण धनराशि:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.panjikaran_dhanrashi}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    पंजीकरण दिनांक:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.panjikaran_dinank ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">आवंटन धनराशि:</span>{" "}
                  {propertyData.propertyRecordDetail.avantan_dhanrashi ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">आवंटन दिनांक:</span>{" "}
                  {propertyData.propertyRecordDetail.avantan_dinank ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">विक्रय धनराशि:</span>{" "}
                  {propertyData.propertyRecordDetail.vikray_mulya}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    फ्री होल्ड धनराशि:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.free_hold_dhanrashi ||
                    "उपलब्ध नहीं"}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">नीलामी धनराशि:</span>{" "}
                  {propertyData.propertyRecordDetail.auction_keemat}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .avshesh_vikray_mulya_ekmusht_jama_dhanrashi
                  }
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    अवशेष विक्रय मूल्य एकमुश्त जमा दिनांक:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .avshesh_vikray_mulya_ekmusht_jama_dinank
                  }
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    एकमुश्त जमा धनराशि पर छूट:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.ekmusht_jama_dhanrashi}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    लीज रेंट धनराशि:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.lease_rent_dhanrashi}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">पार्क चार्ज:</span>{" "}
                  {propertyData.propertyRecordDetail.park_charge ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">कार्नर चार्ज:</span>{" "}
                  {propertyData.propertyRecordDetail.corner_charge ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">अवशेष धनराशि:</span>{" "}
                  {propertyData.propertyRecordDetail.avshesh_dhanrashi}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    अतिरिक्त भूमि की धनराशि:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .atirikt_bhoomi_ki_dhanrashi
                  }
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    पुनर्जीवित शुल्क:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.punarjivit_shulk}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    प्रमाण पत्र शुल्क:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.praman_patra_shulk}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    विज्ञापन शुल्क:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.vigyapan_shulk}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">निबंधन शुल्क:</span>{" "}
                  {propertyData.propertyRecordDetail.nibandhan_shulk}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">निबंधन तिथि:</span>{" "}
                  {propertyData.propertyRecordDetail.nibandhan_dinank ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    पट्टा भिलेख तिथि:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.patta_bhilekh_dinank ||
                    "उपलब्ध नहीं"}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    सीवर/जल कनेक्शन शुल्क:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .sewer_connection_water_connection_charge
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">किश्त योजना</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">ब्याज दर:</span>{" "}
                  {propertyData.propertyRecordDetail.interest_rate}%
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">समय अवधि:</span>{" "}
                  {propertyData.propertyRecordDetail.time_period} वर्ष
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    आदर्श किश्तों की संख्या:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .ideal_number_of_installments
                  }
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    प्रति किश्त आदर्श राशि:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .ideal_installment_amount_per_installment
                  }
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    आदर्श किश्त मूल:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.ideal_kisht_mool}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    आदर्श किश्त ब्याज:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.ideal_kisht_byaj}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    प्रति दिन विलंब शुल्क:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.late_fee_per_day}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    प्रथम किश्त देय तिथि:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.first_installment_due_date}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    कुल ब्याज राशि:
                  </span>{" "}
                  {propertyData.propertyRecordDetail.total_interest_amount}
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">
                    कुल ब्याज राशि का आधा:
                  </span>{" "}
                  {
                    propertyData.propertyRecordDetail
                      .total_interest_amount_div_2
                  }
                </p>
                <p className="flex">
                  <span className="font-semibold min-w-40">कुल योग:</span>{" "}
                  {propertyData.propertyRecordDetail.kul_yog}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">किश्तें</h2>
          </div>
          {propertyData.installments.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full">
                <thead className="bg-blue-200 border-b border-blue-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-black">
                      भुगतान संख्या
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      भुगतान संख्या
                    </th>
                    <th className="py-3 px-4 text-left text-black">स्थिति</th>
                    <th className="py-3 px-4 text-left text-black">
                      भुगतान राशि
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      किश्त मूल भुगतान
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      किश्त ब्याज भुगतान
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      भुगतान देय तिथि
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      भुगतान तिथि
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      विलंब की स्थिति
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      विलंब शुल्क
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      कुल भुगतान राशि
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {propertyData.installments.map((installment, index) => (
                    <tr
                      key={installment.payment_id}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="py-3 px-4">{installment.payment_id}</td>
                      <td className="py-3 px-4">
                        {installment.payment_number}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            installment.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {installment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {installment.payment_amount}
                      </td>
                      <td className="py-3 px-4">
                        {installment.kisht_mool_paid}
                      </td>
                      <td className="py-3 px-4">
                        {installment.kisht_byaj_paid}
                      </td>
                      <td className="py-3 px-4">
                        {installment.payment_due_date}
                      </td>
                      <td className="py-3 px-4">{installment.payment_date}</td>
                      <td className="py-3 px-4">
                        {installment.number_of_days_delayed === 0 ? (
                          <span className="text-green-600">समय पर</span>
                        ) : (
                          <span className="text-red-600">
                            {installment.number_of_days_delayed} दिन विलंब
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {installment.late_fee_amount}
                      </td>
                      <td className="py-3 px-4">
                        {installment.total_payment_amount_with_late_fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-blue-200 p-4 rounded-lg text-blue-700 border border-blue-200">
              कोई किश्तें उपलब्ध नहीं हैं।
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">सेवा शुल्क</h2>
          </div>
          {propertyData.serviceCharges.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full">
                <thead className="bg-blue-200 border-b border-blue-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-black">
                      सेवा शुल्क संख्या
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      वित्तीय वर्ष
                    </th>
                    <th className="py-3 px-4 text-left text-black">स्थिति</th>
                    <th className="py-3 px-4 text-left text-black">
                      सेवा शुल्क राशि
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      विलंब शुल्क
                    </th>
                    <th className="py-3 px-4 text-left text-black">
                      भुगतान तिथि
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {propertyData.serviceCharges.map((charge, index) => (
                    <tr
                      key={charge.service_charge_id}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="py-3 px-4">{charge.service_charge_id}</td>
                      <td className="py-3 px-4">
                        {charge.service_charge_financial_year}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            charge.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {charge.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {charge.service_charge_amount}
                      </td>
                      <td className="py-3 px-4">
                        {charge.service_charge_late_fee}
                      </td>
                      <td className="py-3 px-4">
                        {charge.service_charge_payment_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-blue-200 p-4 rounded-lg text-blue-700 border border-blue-200">
              कोई सेवा शुल्क उपलब्ध नहीं हैं।
            </div>
          )}
        </div>

        {/* Abhiyukti Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">अभियुक्ति</h2>
          </div>
          {propertyData.abhiyukti && propertyData.abhiyukti.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full">
                <thead className="bg-blue-200 border-b border-blue-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-black">Sr. No</th>
                    {/* <th className="py-3 px-4 text-left text-black">उपयोगकर्ता का नाम</th> */}
                    {/* <th className="py-3 px-4 text-left text-black">भूमिका</th> */}
                    {/* <th className="py-3 px-4 text-left text-black">संपत्ति रिकॉर्ड ID</th> */}
                    {/* <th className="py-3 px-4 text-left text-black">निर्माण तिथि</th> */}
                    <th className="py-3 px-4 text-left text-black">टिप्पणी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {propertyData.abhiyukti.map(
                    (item: Abhiyukti, index: number) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
                        <td className="py-3 px-4">{index + 1}.</td>
                        {/* <td className="py-3 px-4">{item.user_name}</td> */}
                        {/* <td className="py-3 px-4">{item.user_role}</td> */}
                        {/* <td className="py-3 px-4">{item.property_record_id}</td> */}
                        {/* <td className="py-3 px-4">{formatDateToDDMMYYYY(item.created_at)}</td> */}
                        <td className="py-3 px-4">{item.comment}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-blue-200 p-4 rounded-lg text-blue-700 border border-blue-200">
              कोई अभियुक्ति उपलब्ध नहीं है।
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <h2 className="text-xl font-semibold text-blue-700">
              स्वामित्व इतिहास (वर्तमान से प्राचीनतम मालिक)
            </h2>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-blue-200 border-b border-blue-200">
                <tr>
                  <th className="py-3 px-4 text-left text-black">
                    आवंटी का नाम
                  </th>
                  <th className="py-3 px-4 text-left text-black">
                    पिता/पति का नाम
                  </th>
                  <th className="py-3 px-4 text-left text-black">
                    हस्तांतरण प्रकार
                  </th>
                  <th className="py-3 px-4 text-left text-black">
                    हस्तांतरण तिथि
                  </th>
                  <th className="py-3 px-4 text-left text-black">संबंध</th>
                  <th className="py-3 px-4 text-left text-black">
                    मोबाइल नंबर
                  </th>
                  <th className="py-3 px-4 text-left text-black">आधार नंबर</th>
                  <th className="py-3 px-4 text-left text-black">
                    दस्तावेजीकरण शुल्क
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {ownershipHistory.map((record, index) => (
                  <tr
                    key={record.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  >
                    <td className="py-3 px-4">{record.avanti_ka_naam}</td>
                    <td className="py-3 px-4">{record.pita_pati_ka_naam}</td>
                    <td className="py-3 px-4">{record.transfer_type}</td>
                    {/* <td className="py-3 px-4">
                      {record.transfer_type === "namantaran"
                        ? "नामांतरण "
                        : "वरासत "}
                    </td> */}
                    <td className="py-3 px-4">
                      {/* {record.transfer_date || "उपलब्ध नहीं"} */}
                      {record.transfer_date
                        ? formatDateToDDMMYYYY(record.transfer_date)
                        : "उपलब्ध नहीं"}
                    </td>
                    <td className="py-3 px-4">
                      {record.relationship || "उपलब्ध नहीं"}
                    </td>
                    <td className="py-3 px-4">{record.mobile_no}</td>
                    <td className="py-3 px-4">{record.aadhar_number}</td>
                    <td className="py-3 px-4">{record.documentation_shulk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isTransferModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  संपत्ति स्थानांतरण
                </h2>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Transfer Type Buttons */}
                <div className="flex gap-4 mb-6">
                  <button
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      transferType === "namantaran"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      setTransferType("namantaran");
                      setFormData((prev) => ({
                        ...prev,
                        transfer_type: "namantaran",
                        relationship: null,
                        advertisement_charges: 0,
                        mitriyu_praman_patra: "",
                        nikat_sambandhi_praman_patra: "",
                      }));
                    }}
                  >
                    नामांतरण
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      transferType === "varasat"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      setTransferType("varasat");
                      setFormData((prev) => ({
                        ...prev,
                        transfer_type: "varasat",
                        relationship: "",
                        documentation_shulk: 0,
                        mutation_charges: 0,
                        bainama_abhilekh: "",
                        ketra_undertaking: "",
                        vikreta_sapath_patra: "",
                      }));
                    }}
                  >
                    वरासत
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Text Inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      आवंटी का नाम
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={formData.avanti_ka_naam}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          avanti_ka_naam: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      पिता/पति का नाम
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={formData.pita_pati_ka_naam}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pita_pati_ka_naam: e.target.value,
                        })
                      }
                    />
                  </div>

                  {transferType === "varasat" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        रिश्ता
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-2 border rounded-lg"
                        value={formData.relationship || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            relationship: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      स्थायी पता
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={formData.avanti_ka_sthayi_pata}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          avanti_ka_sthayi_pata: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      वर्तमान पता
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={formData.avanti_ka_vartaman_pata}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          avanti_ka_vartaman_pata: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      मोबाइल नंबर
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{10}"
                      className="w-full p-2 border rounded-lg"
                      value={formData.mobile_no}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile_no: e.target.value })
                      }
                    />
                  </div>

                  {transferType === "namantaran" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          नामांतरण दिनांक
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full p-2 border rounded-lg"
                          value={formData.transfer_date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              transfer_date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          डाक्युमेंटेशन चार्ज
                        </label>
                        <input
                          type="number"
                          required
                          className="w-full p-2 border rounded-lg"
                          value={formData.documentation_shulk}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documentation_shulk: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          म्यूटेशन चार्ज
                        </label>
                        <input
                          type="number"
                          required
                          className="w-full p-2 border rounded-lg"
                          value={formData.mutation_charges}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mutation_charges: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {transferType === "varasat" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          वरासत दिनांक
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full p-2 border rounded-lg"
                          value={formData.transfer_date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              transfer_date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          विज्ञापन शुल्क
                        </label>
                        <input
                          type="number"
                          required
                          className="w-full p-2 border rounded-lg"
                          value={formData.advertisement_charges}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              advertisement_charges: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      मिसेलेनियस चार्ज
                    </label>
                    <input
                      type="number"
                      required={transferType === "namantaran"}
                      className="w-full p-2 border rounded-lg"
                      value={formData.miscellaneous_charges}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          miscellaneous_charges: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      आधार नंबर
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{12}"
                      className="w-full p-2 border rounded-lg"
                      value={formData.aadhar_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aadhar_number: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* File Input for Aadhar Photo (PNG) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      आधार फोटो (PNG, max 5MB)
                    </label>
                    <input
                      type="file"
                      accept="image/png"
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          "aadhar_photo_link",
                          5 * 1024 * 1024
                        )
                      }
                    />
                    {formData.aadhar_photo_link && (
                      <p className="text-sm text-green-600">
                        Uploaded: {formData.aadhar_photo_link}
                      </p>
                    )}
                  </div>

                  {/* File Inputs for Namantaran */}
                  {transferType === "namantaran" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          बैनामा अभिलेख (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "bainama_abhilekh",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.bainama_abhilekh && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.bainama_abhilekh}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          क्रेता सपथ पत्र (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "ketra_sapath_patra",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.ketra_sapath_patra && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.ketra_sapath_patra}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          क्रेता अंडरटेकिंग (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border Rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "ketra_undertaking",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.ketra_undertaking && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.ketra_undertaking}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          विक्रेता सपथ पत्र (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "vikreta_sapath_patra",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.vikreta_sapath_patra && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.vikreta_sapath_patra}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* File Inputs for Varasat */}
                  {transferType === "varasat" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          क्रेता सपथ पत्र (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "ketra_sapath_patra",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.ketra_sapath_patra && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.ketra_sapath_patra}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          मृत्यु प्रमाण पत्र (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "mitriyu_praman_patra",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.mitriyu_praman_patra && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.mitriyu_praman_patra}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          निकट संबंधी प्रमाण पत्र (PDF, max 10MB)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="w-full p-2 border rounded-lg"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "nikat_sambandhi_praman_patra",
                              10 * 1024 * 1024
                            )
                          }
                        />
                        {formData.nikat_sambandhi_praman_patra && (
                          <p className="text-sm text-green-600">
                            Uploaded: {formData.nikat_sambandhi_praman_patra}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* File Input for PAN Card */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      पैन कार्ड (PDF, max 10MB)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) =>
                        handleFileUpload(e, "pan_card", 10 * 1024 * 1024)
                      }
                    />
                    {formData.pan_card && (
                      <p className="text-sm text-green-600">
                        Uploaded: {formData.pan_card}
                      </p>
                    )}
                  </div>

                  {/* File Input for Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      दस्तावेज (PDF, max 10MB)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) =>
                        handleFileUpload(e, "documents_link", 10 * 1024 * 1024)
                      }
                    />
                    {formData.documents_link && (
                      <p className="text-sm text-green-600">
                        Uploaded: {formData.documents_link}
                      </p>
                    )}
                  </div>

                  {/* Abhiyookti Textarea */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      अभियुक्ति
                    </label>
                    <textarea
                      required
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                      value={formData.abhiyookti}
                      onChange={(e) =>
                        setFormData({ ...formData, abhiyookti: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    रद्द करें
                  </button>
                  <button
                    onClick={handleTransfer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    disabled={uploading}
                  >
                    स्थानांतरण करें
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
