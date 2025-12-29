import axiosInstance from "./axiosInstance";
import store from "../app/store";
import { logout,setCredentials } from "../features/client/account/auth/authslice";

let isRefreshing = false;
let failedQueue = [];
const publicPaths = [
  "/auth/send-otp/",
  "/auth/verify-otp/",
  "/auth/login/",
  "/auth/refresh/",
];


const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (publicPaths.some(p => originalRequest.url.includes(p))) {
      return Promise.reject(error);
    }

    // ✅ STOP refresh if user is already logged out
    const state = store.getState();
    if (!state.auth.accessToken) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
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

      try {
        const res = await axiosInstance.post("/auth/refresh/");
        const newAccessToken = res.data.access;

        store.dispatch(
          setCredentials({
            user: store.getState().auth.user,
            accessToken: newAccessToken,
          })
        );

        axiosInstance.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        if (err.response?.status === 401) {
          store.dispatch(logout());
  }
      return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
