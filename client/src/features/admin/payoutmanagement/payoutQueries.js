import { useQuery } from "@tanstack/react-query";
import { fetchPendingPayouts } from "./payoutApi";

export const usePendingPayouts = (page=1) => {
  return useQuery({
    queryKey: ["pending-payouts",page],
    queryFn: ()=> fetchPendingPayouts(page),
    staleTime: 1000 * 60 * 5, 
  });
};