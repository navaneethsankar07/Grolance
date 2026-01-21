import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { requestContractRevision, updateContractStatus } from './contractApi';

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractData) => {
      const response = await axiosInstance.post('/contracts/', contractData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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