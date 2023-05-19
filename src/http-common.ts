import axios from "axios";
import { getEnvVariables } from "./helpers/getEnvVariables";

export const http = axios.create({
    // baseURL: getEnvVariables().VITE_API_URL,
    baseURL: getEnvVariables().VITE_API_URL,
    headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
        'Content-type': 'application/json'

    },
    withCredentials: false,
});