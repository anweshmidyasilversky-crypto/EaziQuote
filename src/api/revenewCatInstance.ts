import axios from "axios";

export const revenewCatInstance = axios.create({
  baseURL: `https://api.revenuecat.com/v1`,
});

revenewCatInstance.interceptors.request.use((request) => {
  const revenuecatApi = import.meta.env.VITE.REVENEW_CAT_API_TOKEN;
  request.headers.Authorization = `Bearer ${revenuecatApi}`;
  return request;
});
