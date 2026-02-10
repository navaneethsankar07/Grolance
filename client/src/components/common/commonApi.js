import axiosInstance from '../../api/axiosInstance'

export const createSupportTicket = async (ticketData) => {
  const response = await axiosInstance.post('/common/support/tickets/create/', ticketData);
  return response.data;
};