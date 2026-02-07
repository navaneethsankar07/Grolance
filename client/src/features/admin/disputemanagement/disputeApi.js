import axiosInstance from "../../../api/axiosInstance";

export const fetchAdminDisputes = async () => {
  const { data } = await axiosInstance.get(`/contracts/admin/disputes/`);
  console.log(data);
  
  return data;
};

export const fetchAdminDisputeDetail = async (id) => {
  const { data } = await axiosInstance.get(`/contracts/admin/disputes/${id}/`);
  return data;
};

export const resolveDispute = async ({ id, status, admin_notes }) => {
  const { data } = await axiosInstance.post(`/contracts/admin/disputes/${id}/resolve/`, {
    status,
    admin_notes,
  });
  return data;
};