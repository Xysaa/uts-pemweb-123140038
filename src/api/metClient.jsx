import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_MET_API_BASE ??
  "https://collectionapi.metmuseum.org/public/collection/v1";

const API_KEY = import.meta.env.VITE_MET_API_KEY || "";

export const metClient = axios.create({
  baseURL: API_BASE,
  headers: API_KEY ? { "x-api-key": API_KEY } : undefined,
});
