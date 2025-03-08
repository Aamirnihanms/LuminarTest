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


  export const fetchAttendanceApi = async (attendanceBatchDataId, fromDate, toDate) => {
    try {
      const response = await api2.get(`/attendance/batch/${attendanceBatchDataId}/`, {
        params: {
          from_date: fromDate,
          to_date: toDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const fetchDeviceChangeApi = async (page = 1, page_size = 10) => {
    try {
      const response = await api2.get(`/list/device/`, {
        params: { page, page_size }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const ApproveDeviceChangeApi = async (studentId) => {
    try {
      const response = await api2.get(`/device/approve/${studentId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const disaApproveDeviceChangeApi = async (studentId) => {
    try {
      const response = await api2.delete(`/device-change-requests/${studentId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const processApi = async (batchid,token) => {
    try {
      console.log("token available",token)
      const response = await api2.get(`/process/attendance/batch?batch_id=${batchid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
        
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }


 