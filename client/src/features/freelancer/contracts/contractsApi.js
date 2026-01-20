import axiosInstance from "../../../api/axiosInstance";

export const fetchAllContracts = async (params) => {
  const { data } = await axiosInstance.get("/contracts/", { params });
  return data;
};

;

export const fetchContractDetail = async (id) => {
  const { data } = await axiosInstance.get(`/contracts/${id}/`);
  return data;
};

export const submitContractWork = async ({ id, formData }) => {
  const { data } = await axiosInstance.post(
    `/contracts/${id}/submit-work/`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};