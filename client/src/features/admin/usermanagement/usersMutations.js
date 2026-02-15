import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserActive,softDeleteUser } from "./userManagementApi";

// BLOCK / UNBLOCK
export const useToggleUserActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
    },
  });
};

// SOFT DELETE
export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
    },
  });
};
