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

export const forgotPassword = async ({email})=>{
  const res = await axiosInstance.post("/auth/forgot-password/",{ email })
  return res.data
}

export const validateLink = async ({uid,token}) => {
      const res = await axiosInstance.get(`/auth/reset-password/validate/?uid=${uid}&token=${token}`);
      return res.data
    };


export const resetPassword = async({uid, token, newPassword, confirmPassword}) => {
   await axiosInstance.post("/auth/reset-password/", {
          uid,
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        });
}

export const googleAuth = async (idToken) => {
  const res = await axiosInstance.post("/auth/google/", {
    token: idToken,
  });
  return res.data;
};