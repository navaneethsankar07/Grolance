import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";

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