// src/services/settingsApi.js
import axiosInstance from './axiosInstance';

export const fetchMySettings = () => axiosInstance.get('/settings').then(r => r.data);
export const updateMySettings = (payload) => axiosInstance.put('/settings', payload).then(r => r.data);

// admin
export const fetchGlobalSettings = () => axiosInstance.get('/settings/global').then(r => r.data);
export const updateGlobalSettings = (payload) => axiosInstance.put('/settings/global', payload).then(r => r.data);
