import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/reports';

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

export const fetchReportData = async (startDate, endDate) => {
  const response = await fetch(
    `http://localhost:8080/api/reports/summary?startDate=${startDate}&endDate=${endDate}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch report data');
  }
  
  return await response.json();
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

// src/services/reportService.js

const API_BASE_URL = 'http://localhost:8080'; // Your backend URL

export const exportReport = async (type, startDate, endDate) => {
  const url = `${API_BASE_URL}/api/parcels/export/${type}/filtered`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString()
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to export ${type.toUpperCase()}`);
  }

  return await response.blob();
};
//  -------------------------------End This code for Export data --------------------------------------------------------------