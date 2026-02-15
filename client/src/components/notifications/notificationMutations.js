import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "./notificationsApi";


export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};