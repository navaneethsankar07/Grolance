import { useQuery } from "@tanstack/react-query";
import { fetchClientReviews, fetchClientSpendingSummary, getMyProfile } from "./profileApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, 
  });
};



export const useClientSpendingSummary = () => {
    return useQuery({
        queryKey: ["clientSpendingSummary"],
        queryFn: fetchClientSpendingSummary,
        staleTime: 1000 * 60 * 5, 
        retry: 1,
    });
};


export const useClientReviews = (userId) => {
  console.log(userId);
  
  return useQuery({
    queryKey: ["clientReviews", userId],
    queryFn: () => fetchClientReviews(userId),
    enabled: Boolean(userId),
  });
};