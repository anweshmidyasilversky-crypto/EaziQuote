import { store } from "@/redux/store";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const axiosInstance = axios.create({
  baseURL: "https://sandbox.eaziquote.com/api",
  timeout: 5 * 1000,
  headers: {
    "x-api-key": "p7Sp7nxtiIapkc9n5U9OOc2W4hSUCpKxQ55IQDjfoszEmI0nS7",
  },
});

axiosInstance.interceptors.request.use((request) => {
  const auth = store.getState().auth;
  console.log(`apiToken: ${auth.apiToken}`);
  request.headers["Authorization"] = `Bearer ${auth.apiToken}`;
  return request;
});

axiosInstance.interceptors.response.use((response) => {
  console.log(response.data);
  return response;
});

export const showErrorToast = (error: unknown) => {
  if (isAxiosError(error)) {
    toast.error(error.response?.data.message ?? error.message);
  } else {
    toast.error((error as Error).message ?? `Something went wrong`);
  }
};
