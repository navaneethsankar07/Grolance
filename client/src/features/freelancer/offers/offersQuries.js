import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptContract, fetchMyOffers } from "./offersApi";
import { toast } from "react-toastify"; 

export const useMyOffers = () => {
  return useQuery({
    queryKey: ["my-offers"],
    queryFn: fetchMyOffers,
  });
};



export const useAcceptOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptContract,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-offers"]);
      queryClient.invalidateQueries(["contracts"]);
      toast.success("Contract signed successfully! Project started.");
    },
    onError: (error) => {
      // Added toast.error here as well
      const msg = error.response?.data?.error || "Failed to sign contract";
      toast.error(msg);
    }
  });
};