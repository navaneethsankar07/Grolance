import axiosInstance from "../../../api/axiosInstance";

export const fetchTermsSections = async ({ page = 1 }) => {
  const { data } = await axiosInstance.get(`/admin/cms/?category=terms&page=${page}`);
  return data; 
};

export const createTermsSection = async (payload) => {
  const { data } = await axiosInstance.post(`/admin/cms/`, {
    ...payload,
    category: "terms",
  });
  return data;
};

export const updateTermsSection = async (payload) => {
  const { data } = await axiosInstance.patch(`/admin/cms/`, payload);
  return data;
};

export const deleteTermsSection = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/cms/${id}/delete/`);
  return data;
};