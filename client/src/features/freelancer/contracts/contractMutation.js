import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  submitContractWork } from "./contractsApi";


export const useSubmitWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitContractWork,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contract", variables.id] });
    },
  });
};