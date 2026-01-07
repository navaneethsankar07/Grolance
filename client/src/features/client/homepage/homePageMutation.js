// authMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchRole } from "./authAPI";

export const useSwitchRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: switchRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });
};
