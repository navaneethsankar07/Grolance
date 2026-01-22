import axiosInstance from "../../../api/axiosInstance";

export const getReceivedInvitations = async () => {
  const { data } = await axiosInstance.get('/projects/invitations/received/');
  return data;
};

export const updateInvitationStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`/projects/invitations/${id}/update-status/`, {
    status: status 
  });
  return data;
};