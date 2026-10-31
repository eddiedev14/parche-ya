import axios from "axios";

export const nomitanimOSMApi = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
});
