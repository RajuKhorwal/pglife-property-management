// frontend/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "/api",
});

// no interceptor needed — we’ll pass tokenHeader from AuthContext

export default api;
