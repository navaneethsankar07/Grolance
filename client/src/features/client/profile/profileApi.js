import axiosInstance from "../../../api/axiosInstance";

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get("/profile/me/");
  return data;
};


export const updateProfile = async (payload) => {
  console.log('hello');
  
  const { data } = await axiosInstance.patch("/profile/me/update/", payload);
  return data;
};


export const changePassword = async (payload) => {
  const { data } = await axiosInstance.post("/auth/change-password/", payload);
  return data;
};

export const fetchClientSpendingSummary = async () => {
    const { data } = await axiosInstance.get('/payments/client/spending-summary/');
    console.log(data);
    
    return data;
};


export const fetchClientReviews = async (userId) => {
  const { data } = await axiosInstance.get(`/profile/reviews/client/${userId}/`);
  return data;
};