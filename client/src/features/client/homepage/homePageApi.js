import axiosInstance from "../../../api/axiosInstance";

export const switchRole = async ({ role }) => {
  const { data } = await axiosInstance.post(
    "/profile/switch-role/",
    { role }
  );
  return data;
};

