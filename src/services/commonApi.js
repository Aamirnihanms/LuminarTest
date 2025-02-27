import axios from "axios";


export const api1 = axios.create({
  baseURL: import.meta.env.VITE_API_URL_1, 
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});


export const api2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL_2, 
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
