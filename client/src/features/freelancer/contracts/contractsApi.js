import axiosInstance from "../../../api/axiosInstance";

export const fetchAllContracts = async () => {
  const response = await axiosInstance.get("/contracts/");
    console.log(response.data);
    
  return response.data;
};

;

export const fetchContractDetail = async (id) => {
  const { data } = await axiosInstance.get(`/contracts/${id}/`);
  return data;
};