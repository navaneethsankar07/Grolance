import axiosInstance from "../../../api/axiosInstance";

export const fetchAdminFAQs = async (page = 1) => {
    const { data } = await axiosInstance.get(`/admin/faq/?page=${page}`);
    return data;
};

export const createFAQ = async (formData) => {
    const { data } = await axiosInstance.post("/admin/faq/", formData);
    return data;
};

export const updateFAQ = async ({ id, ...formData }) => {
    const { data } = await axiosInstance.put(`/admin/faq/${id}/`, formData);
    return data;
};

export const deleteFAQ = async (id) => {
    const { data } = await axiosInstance.delete(`/admin/faq/${id}/`);
    return data;
};