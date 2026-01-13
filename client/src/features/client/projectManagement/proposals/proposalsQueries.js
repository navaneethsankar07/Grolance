import { useQuery } from "@tanstack/react-query";
import { getSentInvitations } from "./proposalsApi";

export const useSentInvitations = (projectId) => {
  return useQuery({
    queryKey: ['sent-invitations', projectId], 
    queryFn: () => getSentInvitations(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId, 
  });
};