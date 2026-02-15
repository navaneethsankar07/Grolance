import axiosInstance from '../../../api/axiosInstance'

export const fetchMyOffers = async () => {
  const response = await axiosInstance.get("/contracts/my_offers/");
  return response.data;
};


export const acceptContract = async ({ contractId, data }) => {
  const response = await axiosInstance.post(`/contracts/${contractId}/accept/`, data);
  return response.data;
};