import axios from "axios";
import BASE_URL from "../data/endpoint";
const API_BASE_URL = BASE_URL+"/api";

// Yojna APIs
export async function getYojnas() {

  try {
    const response = await axios.get(`${API_BASE_URL}/yojnas`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching yojnas:", error);
    throw error;
  }
}


export async function updateYojna(yojnaId: string, yojnaData: any) {
  try {
    const response = await axios.put(`${API_BASE_URL}/yojnas/${yojnaId}`, yojnaData);
    return response.data;
  } catch (error) {
    console.error("Error updating yojna:", error);
    throw error;
  }
}

// Property APIs
export async function getProperties(params?: {
  page?: number;
  limit?: number;
  id?: string;
  avanti_ka_naam?: string;
  yojna_id?: string;
}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

export async function createProperty(propertyData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

export async function updateProperty(propertyId: string, propertyData: any) {
  try {
    const response = await axios.put(`${API_BASE_URL}/properties/${propertyId}`, propertyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
}
