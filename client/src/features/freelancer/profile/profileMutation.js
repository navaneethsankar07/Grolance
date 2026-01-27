import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentSettings, updateProfile } from "./profileApi";
import { toast } from "react-toastify";

export const useUpdateFreelancerProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedData) => {
            queryClient.invalidateQueries({ queryKey: ['freelancerProfile'] });
            
            queryClient.setQueryData(['freelancerProfile'], updatedData);
            
            toast.success("Profile updated successfully!");
        },
        onError: (error) => {
            const message = error.response?.data?.detail || "Failed to update profile";
            toast.error(message);
        }
    });
};



export const useUpdatePaymentSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePaymentSettings,
        onSuccess: () => {
            queryClient.invalidateQueries(["paymentSettings"]);
            toast.success("PayPal email updated successfully");
        },
        onError: () => toast.error("Failed to update settings")
    });
};