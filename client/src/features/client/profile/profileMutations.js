import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateProfile } from "./profileApi";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};


export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};