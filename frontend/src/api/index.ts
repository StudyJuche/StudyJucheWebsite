import axios from 'axios';

// Create an Axios instance
export const api = axios.create({
    baseURL: '/', // The base URL will be the same as the domain
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
