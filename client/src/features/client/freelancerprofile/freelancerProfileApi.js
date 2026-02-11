import axiosInstance from "../../../api/axiosInstance";

export const fetchFreelancerReviews = async (freelancerId, page = 1) => {
    console.log(freelancerId);
    
  const response = await axiosInstance.get(
    `/profile/freelancers/${freelancerId}/reviews/?page=${page}`
  );
  console.log(response.data);
  
  return response.data;

};