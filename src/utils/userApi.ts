import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "https://kuku-api-production.up.railway.app/v1/users",
  headers : {
    "Content-Type":"application/json",
  },
  withCredentials:true
});

const admin = axios.create({
  baseURL: "https://kuku-api-production.up.railway.app/v1/auth",
  headers : {
    "Content-Type":"application/json",
  },
  withCredentials:true
});

const key = process.env.NEXT_PUBLIC_ADMIN_KEY;

// Type for the expected response from this Api
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// GET Request from this Api
export const getUser = async <T>(endpoint: any): Promise<T> => {
  try {
    const response = await api.get<ApiResponse<T>>(`${endpoint}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
  
};

export const postAdminSession = async <T>(): Promise<T> => {
  try {
    const response = await admin.post<any>('/setsession', 
      {adminKey : key}
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
  }
  
};

// Error handling function
export const handleError = (error: any) => {
  console.error("API Error:", error.response ? error.response.data : error.message);
  throw new Error(error.response?.data?.message || "Something went wrong");
};