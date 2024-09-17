import axios from 'axios';
import { requestOptions } from './auth.header';
import { handleErrorResponse } from '../helpers/handle-response';
const API_URL = 'http://localhost:3000/api/v1';

export const flowService = {
    getAll,
    getById,
    create
};
/// define the interceptor for axios 
axios.interceptors.response.use(response => { 
  return response
},handleErrorResponse)  


function getAll() {
    return axios.get(`${API_URL}/flow`, requestOptions.header())
}

function getById(id) {
    return axios.get(`${API_URL}/flow/${id}`, requestOptions.header())
}

function create(body) { 
    return axios.post(`${API_URL}/flow`,body,requestOptions.header());
}
