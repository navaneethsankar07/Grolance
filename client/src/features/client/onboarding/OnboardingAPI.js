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
    "/profile/freelancer/verify-phone-otp/",
    { phone, otp }
  );
  return data;
};

export const fetchFreelancerProfile = async () => {
  const { data } = await axiosInstance.get("/profile/freelancer/me/");
  return data;
};

export const submitFreelancerOnboarding = async (payload) => {
  const { data } = await axiosInstance.post(
    "/profile/freelancer/onboarding/",
    payload
  );
  return data;
};