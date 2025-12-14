import axiosInstance from "../axiosInstance";

export const sendOtp = async (data) => {
  const res = await axiosInstance.post("/auth/send-otp/", {
    full_name: data.fullName,
    email: data.email,
    password: data.password,
  });
  return res.data;
};

export const verifyOtp = async ({ email, otp_code }) => {
  const res = await axiosInstance.post("/auth/verify-otp/", { email, otp_code });
  return res.data;
};

export const loginUser = async ({ email, password }) => {
  const res = await axiosInstance.post("/auth/login/", { email, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/auth/me/");
  return res.data;
};


export const resendOtp = async ({ email }) => {
  const res = await axiosInstance.post("/auth/resend-otp/", { email });
  return res.data;
};
