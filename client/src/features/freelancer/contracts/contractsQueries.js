import { useQuery } from "@tanstack/react-query";
import { fetchAllContracts, fetchContractDetail } from "./contractsApi";

export const useMyContracts = () => {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: fetchAllContracts,
  });
};

export const useContractDetail = (id) => {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => fetchContractDetail(id),
    enabled: !!id, // Only fetch if ID is provided
  });
};