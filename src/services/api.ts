import axios from "axios";
import BASE_URL from "../data/endpoint";
const API_BASE_URL = BASE_URL+"/api";

export const getYojnas = async () => {
  const response = await fetch(`${BASE_URL}/api/yojna`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header if required: "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch yojnas");
  return response.json();

};

export async function updateYojna(yojnaId: string, yojnaData: any) {
  try {
    const response = await axios.put(`${API_BASE_URL}/yojnas/${yojnaId}`, yojnaData);
    return response.data;
  } catch (error) {
    console.error("Error updating yojna:", error);
    throw error;
  }
}

export const getProperties = async (params) => {
  const query = new URLSearchParams(params).toString();
  const request =  `${BASE_URL}/properties?${query}`
  const response = await fetch(request, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header if required: "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    console.log(request)
    console.log(response);

    throw new Error("Failed to fetch properties")
  };

  return response.json();
};

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


export const fetchTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/api/payments/transaction-logs?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};