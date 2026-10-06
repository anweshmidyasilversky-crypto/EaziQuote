import axios from "axios";

export const revenewCatInstance = axios.create({
  baseURL: `https://api.revenuecat.com/`,
  headers: {
    "x-is-sandbox": true,
    "x-platform": "web",
  },
});

revenewCatInstance.interceptors.request.use((request) => {
  const revenuecatApi = import.meta.env.VITE_REVENEW_CAT_API_TOKEN;
  request.headers.Authorization = `Bearer ${revenuecatApi}`;
  return request;
});
