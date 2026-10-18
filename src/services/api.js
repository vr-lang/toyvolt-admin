import axios from 'axios';

const RAW_API_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://toyvolt-backend-03.onrender.com/api/v1'
).replace(/\/+$/, '');

export const API_BASE_URL = RAW_API_URL;

const SESSION_TOKEN_KEY = 'toyvolt_admin_session_token';

export const getStoredToken = () => {
  try {
    return (
      sessionStorage.getItem(SESSION_TOKEN_KEY) ||
      localStorage.getItem(SESSION_TOKEN_KEY)
    );
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch {
    // Ignore storage quota or access errors
  }
};

/**
 * Primary HTTP Client for Toyvolt Admin Console.
 * Sends credentials for HttpOnly cookie session authentication,
 * with fallback Authorization Bearer header for cross-domain environments.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000, // 20s accommodates Render cold start without hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor: Attach bearer token fallback if available
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Auto-clear token on 401 Unauthorized for protected endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If receiving 401 from protected endpoint (excluding /auth/login), clear stored token
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      setStoredToken(null);
    }
    return Promise.reject(error);
  }
);

/**
 * Parse and classify API errors with actionable user messaging
 */
export const parseApiError = (error, fallback = 'An unexpected error occurred.') => {
  if (!error) {
    return {
      type: 'unknown',
      message: fallback,
      retryable: false
    };
  }

  const res = error.response;
  const status = res?.status;
  const resData = res?.data;

  // 1. Invalid Admin Credentials (401)
  if (status === 401) {
    let msg = 'Invalid Admin ID or Password. Please verify your credentials.';
    if (resData?.message && !resData.message.includes('logged in')) {
      msg = resData.message;
    }
    return {
      type: 'credentials',
      status: 401,
      message: msg,
      retryable: false
    };
  }

  // 2. Forbidden / Authorization Required (403)
  if (status === 403) {
    return {
      type: 'forbidden',
      status: 403,
      message: resData?.message || 'Access denied. Account lacks verified administrator privileges.',
      retryable: false
    };
  }

  // 3. Not Found (404)
  if (status === 404) {
    return {
      type: 'not_found',
      status: 404,
      message: resData?.message || 'The requested endpoint or resource was not found on the backend (404).',
      retryable: false
    };
  }

  // 4. Rate Limiting (429)
  if (status === 429) {
    return {
      type: 'rate_limit',
      status: 429,
      message: 'Too many authentication attempts. Rate limiter engaged. Please wait a few moments before retrying.',
      retryable: true
    };
  }

  // 5. Server Cold Start / Gateway Errors (502, 503, 504)
  if (status === 502 || status === 503 || status === 504) {
    return {
      type: 'cold_start',
      status,
      message: 'Backend server is waking up from idle state (Render cold start). Please click Retry in a few seconds.',
      retryable: true
    };
  }

  // 6. Internal Server Error (500)
  if (status === 500) {
    return {
      type: 'server_error',
      status: 500,
      message: resData?.message || 'Internal backend server error (500). Please check server logs or retry.',
      retryable: true
    };
  }

  // 7. Request Timeout
  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    return {
      type: 'cold_start',
      code: error.code,
      message: 'The request timed out. The backend server on Render may be completing a cold start. Please click Retry.',
      retryable: true
    };
  }

  // 8. Browser Network / CORS Failure
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return {
      type: 'network',
      code: error.code,
      message: 'Cannot reach backend server. Please verify backend status or click Retry to reconnect.',
      retryable: true
    };
  }

  // 9. Standard Backend Error Message Extractor
  if (resData) {
    if (Array.isArray(resData.details) && resData.details.length > 0) {
      return {
        type: 'validation',
        status,
        message: resData.details.map((d) => d.message || d).join(' • '),
        retryable: false
      };
    }
    if (typeof resData.message === 'string' && resData.message.trim()) {
      return {
        type: 'server_message',
        status,
        message: resData.message,
        retryable: false
      };
    }
  }

  return {
    type: 'generic',
    status,
    message: error.message || fallback,
    retryable: false
  };
};

export const getErrorMessage = (error, fallback = 'An unexpected error occurred.') => {
  return parseApiError(error, fallback).message;
};

export default api;
