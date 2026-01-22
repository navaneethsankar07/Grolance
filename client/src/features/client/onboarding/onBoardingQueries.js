import { useQuery } from "@tanstack/react-query";
import { fetchFreelancerProfile } from "./OnboardingAPI";

export const useFreelancerProfile = () => {
  return useQuery({
    queryKey: ["freelancer-profile"],
    queryFn: fetchFreelancerProfile,
    staleTime: 5 * 60 * 1000,
  });
};
