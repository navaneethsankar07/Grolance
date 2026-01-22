import { useQuery } from "@tanstack/react-query";
import { fetchFreelancerProjects } from "./findJobsAPI";

export const useFreelancerProjects = (filters) => {
  return useQuery({
    queryKey: ["freelancer-projects",filters],
    queryFn: ()=> fetchFreelancerProjects(filters),
    staleTime: 60 * 1000,
  });
};
