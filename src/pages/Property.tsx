import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useTranslation } from "../hooks/useTranslation";
import { PropertyStats } from "../components/property/PropertyStats";
import { PropertyTable } from "../components/tables/PropertyTable";
import { Toaster } from "react-hot-toast";
import BASE_URL from "../data/endpoint";

export function Property() {
  const { yojnaId } = useParams(); // Get yojnaId from URL
  const navigate = useNavigate();
  const [stats, setStats] = useState(null); // For PropertyStats
  const [yojnaName, setYojnaName] = useState(""); // To store yojna_name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Fetch yojna name and stats for the specific yojna
  useEffect(() => {
    const fetchYojnaData = async () => {
      try {
        // Fetch yojna details from /api/yojna
        const yojnaResponse = await fetch(`${BASE_URL}/api/yojna${yojnaId ? `?yojna_id=${yojnaId}` : ""}`);
        if (!yojnaResponse.ok) throw new Error("Failed to fetch yojna details");
        const yojnaResult = await yojnaResponse.json();
        const scheme = yojnaResult.data.find((item) => item.yojna_id === yojnaId);
        if (scheme) {
          setYojnaName(scheme.yojna_name);
        } else {
          throw new Error("Yojna not found");
        }

        // Fetch financial stats from /api/financial
        const statsResponse = await fetch(`${BASE_URL}/api/financial${yojnaId ? `?yojna_id=${yojnaId}` : ""}`);
        if (!statsResponse.ok) throw new Error("Failed to fetch financial stats");
        const statsData = await statsResponse.json();
        setStats(statsData.data); // The data is wrapped in a "data" object

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchYojnaData();
  }, [yojnaId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-600">Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">Error: {error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="p-8 max-w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{yojnaName || yojnaId}</h1> {/* Display yojna_name or fallback to yojnaId */}
            <p className="text-gray-600">Manage Property</p>
          </div>
          <button
            onClick={() => navigate("/AddProperty")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>{t("addProperty")}</span>
          </button>
        </div>

        {stats && (
          <PropertyStats
            registrationAmount={parseFloat(stats.total_panjikaran_dhanrashi)}
            freeholdAmount={parseFloat(stats.total_free_hold_dhanrashi)}
            leaseRent={parseFloat(stats.total_lease_rent_dhanrashi)}
            serviceCharge={0} // Not provided in /api/financial, default to 0
            parkCharge={parseFloat(stats.total_park_charge)}
            cornerCharge={parseFloat(stats.total_corner_charge)}
          />
        )}

        <div className="overflow-x-auto rounded-lg">
          <PropertyTable yojna_id={yojnaId} />
        </div>
      </div>
    </DashboardLayout>
  );
}