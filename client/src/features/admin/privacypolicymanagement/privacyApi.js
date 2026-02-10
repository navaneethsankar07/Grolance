import axiosInstance from "../../../api/axiosInstance";

export const fetchprivacypolicies = async ({ page = 1 }) => {
  const { data } = await axiosInstance.get(`/admin/cms/?category=privacy&page=${page}`);
  return data; 
};

export const createPrivacyPolicy = async (payload) => {
  const { data } = await axiosInstance.post(`/admin/cms/`, {
    ...payload,
    category: "privacy",
  });
  return data;
};

export const updatePrivacyPolicy = async (payload) => {
  const { data } = await axiosInstance.patch(`/admin/cms/`, payload);
  return data;
};

export const deletePrivacyPolicy = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/cms/${id}/delete/`);
  return data;
};