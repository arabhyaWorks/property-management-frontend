import React, { useState, useEffect } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import BASE_URL from "../data/endpoint";
import PropertyExportPDF from "../components/PropertyExportPDF";

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
  const [transferType, setTransferType] = useState<"namantaran" | "varasat">("namantaran");
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

  // Render the modal and other components as shown above
  return (
    <DashboardLayout>
      <Toaster />
      {/* Modal JSX as updated above */}
      {/* Other existing JSX for property details */}
    </DashboardLayout>
  );
}