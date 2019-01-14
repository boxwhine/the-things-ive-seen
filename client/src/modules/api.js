import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Add a response interceptor
api.interceptors.response.use(
  ({ data }) => data,
  err => Promise.reject(err),
);

export default api;
