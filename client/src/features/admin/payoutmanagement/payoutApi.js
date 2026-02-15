import axiosInstance from "../../../api/axiosInstance";

export const fetchPendingPayouts = async (page = 1) => {
  const response = await axiosInstance.get(
    `/admin/pending-payouts/?page=${page}`,
  );  
  return response.data;
};

export const releasePayout = async (contractId) => {
  const response = await axiosInstance.post("/payments/release-payout/", {
    contract_id: contractId,
  });
  return response.data;
};
export const refundPayment = async (paymentId) => {
  const { data } = await axiosInstance.post("/payments/refund-payment/", {
    payment_id: paymentId,
  });
  return data;
};
