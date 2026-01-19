import { useQuery } from '@tanstack/react-query';
import { fetchProposals } from './proposalApi';

export const useMyProposals = () => {
  return useQuery({
    queryKey: ['my-proposals'],
    queryFn: fetchProposals,
    staleTime: 1000 * 60 * 5, 
  });
}; 