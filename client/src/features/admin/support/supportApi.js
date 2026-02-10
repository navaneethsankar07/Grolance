import axiosInstance from "../../../api/axiosInstance";

export const fetchSupportTickets = async (page = 1, status = "") => {
  const statusParam = status !== "All Status" ? `&status=${status.toLowerCase()}` : "";
  const { data } = await axiosInstance.get(`/admin/support/tickets/?page=${page}${statusParam}`);
  return data;
};

export const fetchTicketDetails = async (id) => {
  const { data } = await axiosInstance.get(`/admin/support/tickets/${id}/`);
  return data;
};

export const updateTicketReply = async ({ id, admin_reply }) => {
  const { data } = await axiosInstance.patch(`/admin/support/tickets/${id}/`, {
    admin_reply,
  });
  return data;
};