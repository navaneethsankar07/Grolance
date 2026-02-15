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

export const useProposals = (projectId,page=1, status = "") => {
  return useQuery({
    queryKey: ['proposals', projectId, status],
    queryFn: () => getProposals(projectId,page, status),
    staleTime: 1000 * 60 * 5,
  });
};