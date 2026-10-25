import axios from "axios";

export const imageKitApi = axios.create({
  baseURL: "https://parche-ya.vercel.app/api",
});
