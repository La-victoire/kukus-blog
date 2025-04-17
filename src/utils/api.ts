import axios, { AxiosRequestConfig } from "axios";

const postsApi = axios.create({
  baseURL: "https://kuku-api-production.up.railway.app/v1/posts",
  headers : {
    "Content-Type":"multipart/form-data",
  },
  withCredentials:true
});


const profileApi = axios.create({
  baseURL: "https://kuku-api-production.up.railway.app/v1/auth",
  headers : {
    "Content-Type":"application/json",
  },
  withCredentials:true,
  maxRedirects: 0,
  validateStatus : (status) => status >= 200 && status < 400,
});


// Type for the expected response from this Api
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const Oauth = async (endpoint: string, data : any) => {
try {
  const response = await profileApi.post(endpoint,data);
  return response
} catch (error) {
  handleError(error)
  }
};

// GET Request from this Api
export const getData = async <T>(endpoint: any, params?: string): Promise<T> => {
  try {
    const response = await postsApi.get<ApiResponse<T>>(endpoint, {params});
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
  
};

// POST Request from this Api
export const postData = async <T>(endpoint: string, data:any): Promise<T> => {
  try {
    const response = await postsApi.post<ApiResponse<T>>(endpoint,data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};
// PUT Request - Update data
export const putData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await postsApi.put<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// DELETE Request - Remove data
export const deleteData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await postsApi.delete<ApiResponse<T>>(endpoint);
    return response.data.message;
  } catch (error) {
    handleError(error);
  }
};

export const profile = async <T>(endpoint: string, data:any): Promise<T> => {
  try {
    const response = await profileApi.post<ApiResponse<T>>(endpoint,data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const editProfile = async <T>(endpoint: string, data:any): Promise<T> => {
  try {
    const response = await profileApi.put<ApiResponse<T>>(endpoint);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteProfile = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await profileApi.delete<ApiResponse<T>>(endpoint);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Error handling function
export const handleError = (error: any) => {
  console.error("API Error:", error.response ? error.response.data : error.message);
  throw new Error(error.response?.data?.message || "Something went wrong");
};

