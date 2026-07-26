import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
console.log("Using api.js", api.defaults.baseURL);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(
      error.response?.data || {
        message: error.message || "Something went wrong",
      }
    );
  }
);

export default api;