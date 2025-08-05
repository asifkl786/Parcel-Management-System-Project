// src/services/AuthService.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ correct for ES module

const API_URL = 'http://localhost:8080/api/auth/';

export const register = (user) => {
  return axios.post(API_URL + 'register', user);
};

export const login = async (credentials) => {
  const response = await axios.post(API_URL + 'login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// src/services/AuthService.js

export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1])); // JWT decode
  return payload.username || 'Unknown';
};


// This method give me a username and mail for userprofile popup
export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.username || decoded.sub,
      email: decoded.email || decoded.sub,
      role: decoded.role || decoded.sub  // 👈 extract role
    };
  } catch (e) {
    return null;
  }
}

