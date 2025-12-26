import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "./profileApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, 
  });
};