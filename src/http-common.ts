import axios from "axios";
import { getEnvVariables } from "./helpers/getEnvVariables";

export const http = axios.create({
    baseURL: getEnvVariables().VITE_API_URL,
    headers: {
        // 'Access-Control-Allow-Origin': 'http://lxtdnetcor0001:10160',
        "Content-type": "application/json"

    },
    withCredentials: false,
});