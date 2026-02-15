import axiosInstance from "../../../api/axiosInstance";

export const fetchUsers = async ({ page = 1, search = "" ,status=''}) => {
  const res = await axiosInstance.get("/admin/users/", {
    params: { page, search, status },
  });
  return res.data;
};

export const toggleUserActive = async (userId) => {
  const res = await axiosInstance.patch(
    `/admin/users/${userId}/toggle-active/`
  );
  return res.data;
};

export const softDeleteUser = async (userId) => {
  const res = await axiosInstance.delete(
    `/admin/users/${userId}/soft-delete/`
  );
  return res.data;
};
