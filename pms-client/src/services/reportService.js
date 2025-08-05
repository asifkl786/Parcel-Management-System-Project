import axios from 'axios';
//import  axiosInstance  from './axiosInstance';
import  axiosInstance  from "/src/services/axiosInstance.js";


export const getSummaryReport = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const response = await axios.get(`${BASE_API_URL}/summary?${params.toString()}`);
  return response.data;
};

export const getStatusReport = async () => {
  const response = await axios.get(`${BASE_API_URL}/status`);
  return response.data;
};

export const getPerformanceReport = async (month, year) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  const response = await axios.get(`${BASE_API_URL}/delivery-performance?${params.toString()}`);
  return response.data;
};

export const exportToExcel = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  window.open(`${BASE_API_URL}/export?${params.toString()}`, '_blank');
};

export const getParcelList = async () => {
  const response = await axios.get(`${API_URL}/parcels`,);
  return response.data;
}

//  -------------------------------This code Start for Export data --------------------------------------------------------------

// ✅ Service method using axiosInstance
export const fetchReportData = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get('reports/summary', {
      params: { startDate, endDate }
    });
    return response.data; // Axios returns data in response.data
  } catch (error) {
    console.error('Error fetching report data:', error);
    throw error;
  }
};


export const downloadFile = (blob, filename) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
};


export const exportReport = async (type, startDate, endDate) => {
  const url = `/parcels/export/${type}/filtered`; // axiosInstance already has baseURL

  const payload = {
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString()
  };

  const response = await axiosInstance.post(url, payload, {
    responseType: 'blob' // For downloading file
  });

  return response.data; // Return blob
};

//  -------------------------------End This code for Export data --------------------------------------------------------------