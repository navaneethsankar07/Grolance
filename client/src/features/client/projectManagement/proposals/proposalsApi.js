import axiosInstance from "../../../../api/axiosInstance";

export const getSentInvitations = async (projectId) => {
  const params = projectId ? { project_id: projectId } : {};
  const { data } = await axiosInstance.get('/projects/invitations/sent/', { params });
  return data;
};

export const getProposals = async (projectId, page=1,status = "") => {
  const { data } = await axiosInstance.get(`/projects/${projectId}/proposals/`, {
    params: {page, status }
  });
  return data;
};

export const rejectProposal = async (proposalId) => {
  const res = await axiosInstance.patch(`/projects/proposals/${proposalId}/reject/`);
  return res.data;
};
