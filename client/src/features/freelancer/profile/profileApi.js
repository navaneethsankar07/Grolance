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