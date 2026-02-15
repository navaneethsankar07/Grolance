import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveDispute } from "./disputeApi";

export const useResolveDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resolveDispute,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["admin", "disputes", variables.id]);
      queryClient.invalidateQueries(["admin", "disputes"]);
          },
    onError: (error) => {
      const message = error.response?.data?.error || "Failed to update case.";
      alert(`Decision Error: ${message}`);
    }
  });
};