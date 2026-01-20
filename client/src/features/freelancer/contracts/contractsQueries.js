import { useQuery } from "@tanstack/react-query";
import { fetchAllContracts, fetchContractDetail } from "./contractsApi";

export const useMyContracts = (filters) => {
  return useQuery({
    queryKey: ["contracts", filters],
    queryFn: () => fetchAllContracts(filters),
    keepPreviousData: true,
  });
};

export const useContractDetail = (id) => {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => fetchContractDetail(id),
    enabled: !!id, 
  });
};