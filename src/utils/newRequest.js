import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:5021/api/",
  withCredentials: true,
});

newRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // or wherever you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Poprawnie interpolowany ciąg
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
