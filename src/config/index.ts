import axios, { AxiosInstance } from "axios";

export const KUSONIME_API: string = "https://kusonime-restapi.vercel.app/api";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: KUSONIME_API,
  headers: { "User-Agent": "*", Connection: "keep-alive" },
});
