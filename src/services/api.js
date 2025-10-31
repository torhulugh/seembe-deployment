import axios from "axios";

const api = axios.create({
  baseURL: "https://torseembe.vercel.app/api",
  // baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("seembe:user");
    }
    return Promise.reject(error);
  }
);

export default api;
