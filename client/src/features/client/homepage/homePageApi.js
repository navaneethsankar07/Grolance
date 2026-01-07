import axiosInstance from "../api/axiosInstance";

export const switchRole = async ({ role }) => {
  const { data } = await axiosInstance.post(
    "/auth/switch-role/",
    { role }
  );
  return data;
};
