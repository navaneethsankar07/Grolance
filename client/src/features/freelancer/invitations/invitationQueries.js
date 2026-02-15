import { useQuery } from '@tanstack/react-query';
import { getReceivedInvitations } from './invitationApi';

export const useReceivedInvitations = () => {
  return useQuery({
    queryKey: ['received-invitations'],
    queryFn: getReceivedInvitations,
    staleTime: 1000 * 60 * 5, 
  });
};