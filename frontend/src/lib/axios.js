import axios from "axios";

const BASE_URL = "https://neurochat-7ouk.onrender.com" // import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
