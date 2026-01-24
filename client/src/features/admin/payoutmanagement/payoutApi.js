import axiosInstance from "../../../api/axiosInstance";

export const fetchPendingPayouts = async () => {
  const response = await axiosInstance.get('/admin/pending-payouts/');
  return response.data;
};

export const releasePayout = async ({ contractId, platformEmail }) => {
  const response = await axiosInstance.post('/payments/release-payout/', {
    contract_id: contractId,
    platform_paypal_email: platformEmail
  });
  return response.data;
};