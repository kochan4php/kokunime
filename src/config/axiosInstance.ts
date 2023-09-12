import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "https://brick-red-cricket-gown.cyclic.app/api",
});

export default axiosInstance;
