import { useQuery  } from "@tanstack/react-query";
import { fetchNotifications } from "./notificationsApi";

export const useNotifications = (fetchAll = false) => {
  return useQuery({
    queryKey: ["notifications", fetchAll],
    queryFn: () => fetchNotifications(fetchAll),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};