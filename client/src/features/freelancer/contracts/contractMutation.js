import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  createDispute, postRevisionAction, submitContractWork } from "./contractsApi";
import { toast } from "react-toastify";


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


export const useDisputeMutation = () => {
  return useMutation({
    mutationFn: createDispute,
    onSuccess: () => {
      queryClient.invalidateQueries(["contractDetail"]);      
      toast.success("Dispute raised successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || error.response?.data?.detail|| "Failed to raise dispute");
      console.log(error);
      
    }
  });
};