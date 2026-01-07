import axiosInstance from "../../../api/axiosInstance";

export const fetchFreelancerProjects = async (params) => {
  const { data } = await axiosInstance.get(
    "/projects/freelancer/project-list/", {params}
  );
  return data;
};
