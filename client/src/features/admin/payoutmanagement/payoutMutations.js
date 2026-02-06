import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { refundPayment, releasePayout } from './payoutApi';

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


export const useRefundPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: refundPayment,
        onSuccess: () => {
            queryClient.invalidateQueries(['pending-payouts']);
            toast.success("Refund processed successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || "Refund failed");
        }
    });
};