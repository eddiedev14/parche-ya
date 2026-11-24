import axios from "axios";

export const imageKitApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});
