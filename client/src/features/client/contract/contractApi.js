import axiosInstance from '../../../api/axiosInstance'

export const requestContractRevision = async ({ contractId, reason }) => {
  const response = await axiosInstance.post(`/contracts/${contractId}/request-revision/`, { reason });
  return response.data;
};

export const updateContractStatus = async ({ contractId, status }) => {
  const response = await axiosInstance.patch(`/contracts/${contractId}/status_update/`, { status });
  return response.data;
};