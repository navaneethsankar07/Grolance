import { useQuery } from '@tanstack/react-query';
import { fetchProposals } from './proposalApi';

export const useMyProposals = (params) => {
  return useQuery({
    queryKey: ['my-proposals',params],
    queryFn: ()=>fetchProposals(params),
    staleTime: 1000 * 60 * 5, 
  });
}; 