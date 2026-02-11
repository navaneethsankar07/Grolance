import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview, requestContractRevision, updateContractStatus, verifyPayment } from './contractApi';
import { toast } from 'react-toastify';

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      
      if (variables.project_id) {
        queryClient.invalidateQueries({ queryKey: ['proposals', variables.project_id] });
        queryClient.invalidateQueries({ queryKey: ['sent-invitations', variables.project_id] });
      }
      
      queryClient.invalidateQueries({ queryKey: ['my_offers'] });
    },
  });
};

export const useRequestRevision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestContractRevision,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["contract", variables.contractId]);
    },
  });
};

export const useUpdateContractStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContractStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["contract", variables.contractId]);
    },
  });
};


export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      toast.success("Review submitted successfully!");
      
      queryClient.invalidateQueries({ 
        queryKey: ["contract", String(variables.contract),],
        exact: true 
      });

      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      const msg = error.response?.data?.detail || "Failed to submit review.";
      toast.error(msg);
    },
  });
};