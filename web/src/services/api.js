import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1234'
});

export default api;