import axiosInstance from "../../../../api/axiosInstance";

export const createProposal = async (proposalData) => {
  const response = await axiosInstance.post('/projects/create-proposal/', proposalData);
  return response.data;
};


export const fetchProposals = async () =>{
  const response = await axiosInstance.get('/projects/my-proposals/')
  return response.data;
}