import axiosInstance from "../../../api/axiosInstance";

export const fetchFreelancerReviews = async (freelancerId, page = 1) => {
  const response = await axiosInstance.get(
    `/profile/freelancers/${freelancerId}/reviews/?page=${page}`,
  );

  return response.data;
};
