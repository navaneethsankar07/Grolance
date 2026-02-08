import axiosInstance from "../../../api/axiosInstance";

export const fetchGlobalSettings = async () => {
  const response = await axiosInstance.get('/admin/settings/global/');
  return response.data;
};

export const updateGlobalSettings = async (settingsData) => {
  const response = await axiosInstance.patch('/admin/settings/global/', settingsData);
  return response.data;
};