import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const register = async (email: string, password: string) =>
  axios.post(`${API_URL}/auth/register`, { email, password });

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  localStorage.setItem("token", response.data.token);
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
