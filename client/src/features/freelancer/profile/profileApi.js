import axiosInstance from "../../../api/axiosInstance"

export const fetchFreelancerProfile = async ()=>{
    const res = await axiosInstance.get('/profile/freelancer/profile/');
    return res.data;
}

export const updateProfile = async (data) => {
    const res = await axiosInstance.patch('/profile/freelancer/profile/', data);
    return res.data;
}

export const fetchFreelancerTransactions = async ({ status, range, page }) => {
  const { data } = await axiosInstance.get("/payments/freelancer/transaction-history/", {
    params: {
      status: status !== "All Statuses" ? status.toLowerCase() : undefined,
      range: range !== "All Time" ? range : undefined,
      page: page,
    },
  });
  return data;
};

export const fetchPaymentSettings = async () => {
    const { data } = await axiosInstance.get('/profile/freelancer/payment-settings/');
    return data;
};

export const updatePaymentSettings = async (payload) => {
    const { data } = await axiosInstance.put('/profile/freelancer/payment-settings/', payload);
    return data;
};