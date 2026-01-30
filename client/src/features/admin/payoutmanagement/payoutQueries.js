import { useQuery } from "@tanstack/react-query";
import { fetchPendingPayouts } from "./payoutApi";

export const usePendingPayouts = () => {
  return useQuery({
    queryKey: ["pending-payouts"],
    queryFn: fetchPendingPayouts,
    staleTime: 1000 * 60 * 5, 
  });
};