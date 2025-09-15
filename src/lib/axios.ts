import axios, { AxiosInstance } from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const http: AxiosInstance = axios.create({
  baseURL: "https://eman-nest.vercel.app",
  // baseURL: "http://localhost:3000",
  headers: { Authorization: `Bearer ${cookies.get("token")}` },
});

export default http;
