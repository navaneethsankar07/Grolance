import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProposal } from './proposalApi';
import { toast } from 'react-toastify';

export const useSubmitProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal submitted successfully!');
    },
    onError: (error) => {
    const errorData = error.response?.data
    const message = errorData?.non_field_errors?.[0] || 
                      errorData?.project?.[0] || 
                      errorData?.detail || 
                      'Failed to submit proposal';
      
      toast.error(message);
    }
  });
};