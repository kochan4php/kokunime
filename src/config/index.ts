import axios, { AxiosInstance } from "axios";

export const KUSONIME_URL: string = "https://kusonime.com/";

export const kusonime: AxiosInstance = axios.create({
    baseURL: KUSONIME_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "*",
        Referer: "https://kusonime.com/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        Connection: "keep-alive",
        Host: "kusonime.com",
        Origin: "https://kusonime.com",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Site": "none",
    },
});
