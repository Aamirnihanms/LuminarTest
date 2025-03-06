import { api1 } from "./commonApi"; 
import { api2 } from "./commonApi";


export const loginUser = async (username, password) => {
  try {
    const response = await api1.post("/user/login", { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchBatchesApi = async (token) => {
    try {
      const response = await api1.get(
        "/batch?_end=500&_order=DESC&_sort=createdAt&_start=0&filter=%5B%5D",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data || [];
    } catch (error) {
      throw error;
    }
  };


  export const fetchAttendanceApi = async (attendanceBatchDataId) => {
    try {
      const response = await api2.get(`/attendance/batch/${attendanceBatchDataId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const fetchDeviceChangeApi = async () => {
    try {
      const response = await api2.get(`/list/device/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


 