import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  postRevisionAction, submitContractWork } from "./contractsApi";


export const useSubmitWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitContractWork,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contract", variables.id] });
    },
  });
};

export const useRevisionAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postRevisionAction,
    onSuccess: () => {
      queryClient.invalidateQueries(["contractDetail"]);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || "Failed to update revision status";
      console.error("Revision Action Error:", errorMsg);
    }
  });
};