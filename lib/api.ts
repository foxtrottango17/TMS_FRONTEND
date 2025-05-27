import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

// Extend the AxiosRequestConfig interface to include _retry
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      if (!originalRequest._retry) {
        originalRequest._retry = true
        
        try {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN)
          if (refreshToken) {
            const response = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, {
              refresh: refreshToken
            })
            
            const { access } = response.data
            localStorage.setItem(ACCESS_TOKEN, access)
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access}`
            }
            return api(originalRequest)
          }
        } catch (refreshError) {
          // If refresh token fails, clear auth and redirect to login
          localStorage.removeItem(ACCESS_TOKEN)
          localStorage.removeItem(REFRESH_TOKEN)
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // If we already tried to refresh and still got 401, redirect to login
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        window.location.href = '/login'
      }
    }
    
    // Log other errors
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      })
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Request setup error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api
