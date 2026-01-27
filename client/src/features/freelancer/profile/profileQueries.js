import { useQuery } from "@tanstack/react-query"
import { fetchFreelancerProfile, fetchFreelancerTransactions } from "./profileApi"

export const useFreelancerProfile = ()=>{
    return useQuery({
        queryKey:['freelancerProfile'],
        queryFn:fetchFreelancerProfile,
        staleTime:1000 * 60 * 5
    })
}

export const useFreelancerTransactions = (filters) => {
  return useQuery({
    queryKey: ["freelancerTransactions", filters],
    queryFn: () => fetchFreelancerTransactions(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};