import axiosInstance from "../../../api/axiosInstance";

export const sendPhoneOtp = async ({ phone }) => {
  const { data } = await axiosInstance.post(
    "/profile/freelancer/send-phone-otp/",
    { phone }
  );
  return data;
};

export const verifyPhoneOtp = async ({ phone, otp }) => {
  const { data } = await axiosInstance.post(
    "/profile/freelancer/phone/verify-otp/",
    { phone, otp }
  );
  return data;
};

export const fetchFreelancerProfile = async () => {
  const { data } = await axiosInstance.get("/profile/me/");
  return data;
};
