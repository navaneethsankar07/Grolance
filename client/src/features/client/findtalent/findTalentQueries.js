import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInvitation, fetchEligibleJobs, getFreelancerList } from "./findTalentApi";

export const useFreelancerList = (filters) => {
  return useQuery({
    queryKey: ["freelancers-list", filters],
    queryFn: () => getFreelancerList(filters),
    placeholderData: (previousData) => previousData,
  });
};


export const useEligibleProjects = (isOpen) => {
  return useQuery({
    queryKey: ['eligible-projects'],
    queryFn: fetchEligibleJobs,
    enabled: !!isOpen,
  });
};

export const useSendInvitation = (options) => { 
  const queryClient = useQueryClient();
    console.log(options);
    
  return useMutation({
    mutationFn: createInvitation,
    ...options, 
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};