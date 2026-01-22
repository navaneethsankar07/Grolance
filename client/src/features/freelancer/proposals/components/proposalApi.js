import axiosInstance from "../../../../api/axiosInstance";

export const createProposal = async (proposalData) => {
  const response = await axiosInstance.post('/projects/create-proposal/', proposalData);
  return response.data;
};