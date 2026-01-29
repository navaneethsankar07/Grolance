import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectProposal } from "./proposalsApi";
import { toast } from "react-toastify";

export const useRejectProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId) => rejectProposal(proposalId),
    onSuccess: (_, proposalId) => {
      queryClient.invalidateQueries(["proposals"]);
      toast.success("Proposal rejected successfully");
    },
    onError: (error) => {
      const msg = error.response?.data?.error || "Failed to reject proposal";
      toast.error(msg);
    },
  });
};