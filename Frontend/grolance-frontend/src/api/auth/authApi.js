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