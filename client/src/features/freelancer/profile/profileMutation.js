import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "./profileApi";

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