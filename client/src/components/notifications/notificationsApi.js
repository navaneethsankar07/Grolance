import axiosInstance from "../../api/axiosInstance";

export const fetchNotifications = async (fetchAll = false) => {
  const { data } = await axiosInstance.get(`/communication/notifications/?all=${fetchAll}`);
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await axiosInstance.patch(`/communication/notifications/${id}/read/`);
  return data;
};