// services/api.ts
import axios from 'axios';
import newBaseEndpoint from './enpoints';

// const API_BASE_URL = 'http://localhost:3000/api';
// const API_BASE_URL = 'https://apiproperty.bidabhadohi.com/api';
const API_BASE_URL =  newBaseEndpoint +'/api';



interface LoginResponse {
  message: string;
}

interface VerifyOTPResponse {
  token: string;
}

interface PropertyRecord {
  property_unique_id: string;
  yojna_id: string;
  avanti_ka_naam: string;
  sampatti_sreni: string;
}

interface InstallmentPlan {
  avshesh_dhanrashi: string;
  interest_rate: string;
  ideal_kisht_mool: string;
  ideal_kisht_byaj: string;
  late_fee_per_day: string;
  first_installment_due_date: string | null;
  next_due_date: string | null;
  number_of_installment_paid: number;
  ideal_number_of_installments: number;
}

interface PropertyResponse {
  data: Array<{
    propertyRecord: PropertyRecord;
    installmentPlan: InstallmentPlan;
    installments: Array<any>;
    serviceCharges: Array<any>;
  }>;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addServiceCharge = async (serviceChargeData: any) => {
  const response = await axios.post(`${API_BASE_URL}/payments/service-charges`, serviceChargeData);
  console.log(response);
  return response.data;
};

export const getProperties = async (mobile_no: string): Promise<PropertyResponse> => {
  try {
    const response = await api.get<PropertyResponse>('/users/by-mobile', {
      params: {
        page: 1,
        limit: 10,
        mobile_no,
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('bida_token')}`,
      },
    });
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch properties');
    }
    throw new Error('Failed to fetch properties. Please try again.');
  }
};

export const loginUser = async (mobile_number: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(newBaseEndpoint+"/api/users/login/otp/send", {
      mobile_number,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Failed to send OTP. Please try again.');
  }
};

export const verifyOTP = async (mobile_number: string, otp: string): Promise<VerifyOTPResponse> => {
  try {
    const response = await api.post<VerifyOTPResponse>(newBaseEndpoint+"/api/users/login/otp/verify", {
      mobile_number,
      otp,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
    throw new Error('Failed to verify OTP. Please try again.');
  }
};

export {API_BASE_URL};