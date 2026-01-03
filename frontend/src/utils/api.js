// frontend/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://pglife-property-management-backend.onrender.com" || "http://localhost:5000/api",
});

// no interceptor needed — we’ll pass tokenHeader from AuthContext

export default api;
