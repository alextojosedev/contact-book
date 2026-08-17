import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://contact-book-06dr.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cb_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired and not during login/register request
      if (
        !error.config.url.includes("/auth/token/") &&
        !error.config.url.includes("/auth/register/") &&
        !error.config.url.includes("/auth/demo-login/")
      ) {
        localStorage.removeItem("cb_access_token");
        localStorage.removeItem("cb_refresh_token");
        localStorage.removeItem("cb_user");
        window.dispatchEvent(new Event("cb_auth_expired"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
