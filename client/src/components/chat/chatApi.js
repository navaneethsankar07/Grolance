import axiosInstance from "../../api/axiosInstance";

export const fetchChatRooms = async () => {
  const response = await axiosInstance.get("/communication/rooms/");
  return response.data;
};

export const fetchMessages = async ({ roomId, pageParam = 1 }) => {
  const response = await axiosInstance.get(`/communication/rooms/${roomId}/messages/?page=${pageParam}`);
  return response.data; 
};

export const getOrCreateRoom = async (userId) => {
  const response = await axiosInstance.post("/communication/rooms/get_or_create_room/", { user_id: userId });
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await axiosInstance.delete(`/communication/messages/${messageId}/`);
  return response.data;
};