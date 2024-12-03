import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001/api",
    withCredentials: true,
})