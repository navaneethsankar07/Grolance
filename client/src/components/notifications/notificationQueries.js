import { useQuery  } from "@tanstack/react-query";
import { fetchNotifications } from "./notificationsApi";
import { useSelector } from "react-redux";

export const useNotifications = (fetchAll = false,options={}) => {
  const {user} = useSelector(state=>state.auth)
  return useQuery({
    queryKey: ["notifications", fetchAll],
    queryFn: () => fetchNotifications(fetchAll),
    staleTime: 1000 * 60 * 5,
    enabled: !!user && (options.enabled !== false),
    refetchOnWindowFocus: false,
  });
};