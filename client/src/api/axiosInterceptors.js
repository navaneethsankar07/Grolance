import axios from "axios";
import axiosInstance from "./axiosInstance";
import store from "../app/store";
import {
  logout,
  setCredentials,
} from "../features/client/account/auth/authslice";

let isRefreshing = false;
let failedQueue = [];
const publicRoutes = [
      "/auth/send-otp/", 
      "/auth/verify-otp/", 
      "/auth/login/", 
      "/auth/refresh/",
      "/auth/forgot-password/",
      "/auth/reset-password/"
    ];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
    const token = store.getState().auth.accessToken;
    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || originalRequest.url.includes("/auth/refresh/")) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh/`,
          {},
          { withCredentials: true },
        );

        const newAccess = res.data.access;

        store.dispatch(
          setCredentials({
            user: store.getState().auth.user,
            accessToken: newAccess,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        resolve(axiosInstance(originalRequest));
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        reject(err);
      } finally {
        isRefreshing = false;
      }
    });
  },
);
