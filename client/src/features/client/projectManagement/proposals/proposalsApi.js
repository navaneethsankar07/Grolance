import axiosInstance from "../../../../api/axiosInstance";

export const getSentInvitations = async (projectId) => {
  const params = projectId ? { project_id: projectId } : {};
  const { data } = await axiosInstance.get('/projects/invitations/sent/', { params });
  return data;
};