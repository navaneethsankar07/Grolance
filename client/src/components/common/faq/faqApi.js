import axiosInstance from "../../../api/axiosInstance";

export const fetchPublicFAQs = async (category = "", page = 1) => {
  const { data } = await axiosInstance.get("/common/public/faq/", {
    params: { 
      category: category || undefined,
      page: page
    }
  });
  return data;
};