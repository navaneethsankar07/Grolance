import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import { fetchFreelancerReviews } from "./freelancerProfileApi";

export const useClientFreelancerProfile = (id) => {
  return useQuery({
    queryKey: ["freelancer-profile", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/profile/freelancer/profile/${id}/`);
      return data;
    },
    enabled: !!id, 
  });
};


export const useFreelancerReviews = (freelancerId, page = 1) => {
  return useQuery({
    queryKey: ["reviews", freelancerId, page],
    queryFn: () => fetchFreelancerReviews(freelancerId, page),
    enabled: !!freelancerId,
  });
};