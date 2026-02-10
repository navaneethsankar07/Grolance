import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createPrivacyPolicy, deletePrivacyPolicy, updatePrivacyPolicy } from "./privacyApi";

export const usePrivacyMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPrivacyPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["privacypolicy"]);
      toast.success("Section added successfully");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to add section"),
  });

  const updateMutation = useMutation({
    mutationFn: updatePrivacyPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["privacypolicy"]);
      toast.success("Section updated successfully");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to update section"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrivacyPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["privacypolicy"]);
      toast.success("Section deleted successfully");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to delete section"),
  });

  return { createMutation, updateMutation, deleteMutation };
};