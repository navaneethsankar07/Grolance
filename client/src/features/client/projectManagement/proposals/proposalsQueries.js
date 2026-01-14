import { useQuery } from "@tanstack/react-query";
import { getProposals, getSentInvitations } from "./proposalsApi";

export const useSentInvitations = (projectId) => {
  return useQuery({
    queryKey: ['sent-invitations', projectId], 
    queryFn: () => getSentInvitations(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId, 
  });
};

export const useProposals = (projectId) => {
  return useQuery({
    queryKey:['proposals',projectId],
    queryFn:()=>getProposals(projectId),
    staleTime:1000 * 60 * 5
  })
}