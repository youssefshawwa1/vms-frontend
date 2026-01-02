import axios from "axios";

const api = axios.create({
  // Use the root URL so you can hit different endpoints
  baseURL: "https://vms-frontend-production.up.railway.app/",
});

// This interceptor sits between your app and the server
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // 1. Attach the token to the headers
      config.headers.Authorization = `Bearer ${token}`;

      // 2. (Optional) If your backend specifically requires a userId header:
      // const userId = localStorage.getItem("userId");
      // if (userId) config.headers['x-user-id'] = userId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
