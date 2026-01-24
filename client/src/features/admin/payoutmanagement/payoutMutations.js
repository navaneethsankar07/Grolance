import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { releasePayout } from './payoutApi';

export const useReleasePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: releasePayout,
    onSuccess: () => {
      toast.success("Funds released successfully!");
      queryClient.invalidateQueries(['contracts']); 
    },
    onError: (error) => {
      const msg = error.response?.data?.error || "Payout failed";
      toast.error(msg);
    }
  });
};