import axios from 'axios';

const API_URL = 'http://localhost:8080/api/parcels';

// Create Axios instance with token interceptor
const axiosInstance  = axios.create({
  baseURL: API_URL,
});

// Auto-attach Bearer token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// This is get Parcles method 
export const getParcels = async () => {
  const response = await axiosInstance.get(`${API_URL}/parcels`,);
  return response.data;
};

// This is getparcel by id
export const getParcelById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

// This method use when send data as one object
export const createParcelWithOneObject = async (parcelData, file) => {
  const formData = new FormData();
  formData.append('parcel', JSON.stringify(parcelData));
  if (file) {
    formData.append('file', file);
  }
  
  const response = await axios.post(`${API_URL}/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// This method for update parcel
export const updateParcel = async (id, parcelData) => {
  try {  
    const response = await axios.put(`${API_URL}/${id}/update`, parcelData,{
    headers: {
         'Content-Type':'application/json',
         'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
    return response.data;
  } catch (error) {
    console.error('Error updating parcel:', error);
    throw error;
  }
};

  // Helper function to format dates consistently
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM:SS"
  }

export const deleteParcel = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const markAsDelivered = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/deliver`);
  return response.data;
};

export const getParcelByTrackingNumber = async (trackingNumber) => {
  const response = await axiosInstance.get(`${API_URL}/tracking?number=${trackingNumber}`);
  return response.data;
};

// This service  alternative for create parcel
export const uploadParcel = async (parcelData) => {
  const formData = new FormData();
  formData.append('senderName', parcelData.senderName);
  formData.append('recipientName', parcelData.recipientName);
  formData.append('recipientEmail', parcelData.recipientEmail);
  formData.append('trackingNumber', parcelData.trackingNumber);
  formData.append('status', parcelData.status);
  formData.append('receivedAt', parcelData.receivedAt);
  formData.append('deliveredAt', parcelData.deliveredAt);
  formData.append('imageFile', parcelData.imageFile); // Must match field name in DTO

  return axios.post(`${API_URL}/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/*--------------------------------------------------------------Pagination Code Start------------------------------------------------*/

export const getParcelsWithPagination = async (page = 0, size = 5, sortBy = 'receivedAt', sortDir = 'desc') => {
  const response = await axiosInstance.get(`${API_URL}`, {
    params: { 
      page, 
      size,
      sortBy,
      sortDir
    },
  });
  return response.data;
};

export const getParcelsByStatus = async (status, page = 0, size = 10) => {
  const response = await axios.get(`${API_URL}/filter`, {
    params: { status, page, size },
    headers: {
        Authorization: `Bearer ${token}`
    },
  });
  return response.data;
};
/*--------------------------------------------------------------Pagination Code End------------------------------------------------*/

// This method for createParcel
export const createParcel = async (parcelData) => {
  const formData = new FormData();
  
  // Append all basic fields
  formData.append('senderName', parcelData.senderName);
  formData.append('recipientName', parcelData.recipientName);
  formData.append('recipientEmail', parcelData.recipientEmail);
  formData.append('originCity', parcelData.originCity);
  formData.append('destinationCity', parcelData.destinationCity);
  formData.append('shippingCost', parcelData.shippingCost);
  formData.append('additionalFees', parcelData.additionalFees);
  formData.append('totalValue', parcelData.totalValue);
  formData.append('paymentMethod', parcelData.paymentMethod);
  formData.append('parcelType', parcelData.parcelType);
  formData.append('weightCategory', parcelData.weightCategory);
  formData.append('status', parcelData.status);
  formData.append('receivedAt', parcelData.receivedAt);
  formData.append('estimatedDeliveryAt', parcelData.estimatedDeliveryAt);
 // formData.append('deliveredAt', parcelData.deliveredAt || '');
 // formData.append('imageFile', parcelData.imageFile); // Must match field name in DTO

  // Best practice to handle separate file and date  ✔ Skips empty date fields,✔ Adds file only if present
   
    if (parcelData.deliveredAt) {
      formData.append("deliveredAt", parcelData.deliveredAt);
    }

    if (parcelData.imageFile) {
      formData.append("imageFile", parcelData.imageFile);
    }

   const response = await axiosInstance.post(`${API_URL}/create`, formData, {
     headers:{
         'Content-Type': 'multipart/form-data',
     },
   });
   return response.data;
   
};
 