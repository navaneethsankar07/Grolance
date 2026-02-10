import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTermsSection, deleteTermsSection, updateTermsSection } from "./termsApi";
import { toast } from "react-toastify";

export const useTermsMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTermsSection,
    onSuccess: () => {
      queryClient.invalidateQueries(["termsSections"]);
      toast.success("Section added successfully");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to add section"),
  });

  const updateMutation = useMutation({
    mutationFn: updateTermsSection,
    onSuccess: () => {
      queryClient.invalidateQueries(["termsSections"]);
      toast.success("Section updated successfully");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to update section"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTermsSection,
    onSuccess: () => {
      queryClient.invalidateQueries(["termsSections"]);
      toast.success("Section deleted successfully");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to delete section"),
  });

  return { createMutation, updateMutation, deleteMutation };
};