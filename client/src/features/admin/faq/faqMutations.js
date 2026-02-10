import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFAQ, updateFAQ, deleteFAQ } from "./faqApi";
import { toast } from "react-toastify";

export const useFAQMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createFAQ,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-faqs"]);
            toast.success("FAQ created successfully");
        },
        onError: () => toast.error("Failed to create FAQ")
    });

    const updateMutation = useMutation({
        mutationFn: updateFAQ,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-faqs"]);
            toast.success("FAQ updated successfully");
        },
        onError: () => toast.error("Failed to update FAQ")
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFAQ,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-faqs"]);
            toast.success("FAQ deleted successfully");
        },
        onError: () => toast.error("Failed to delete FAQ")
    });

    return { createMutation, updateMutation, deleteMutation };
};