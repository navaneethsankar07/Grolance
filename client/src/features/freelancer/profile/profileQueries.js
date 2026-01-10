import { useQuery } from "@tanstack/react-query"
import { fetchFreelancerProfile } from "./profileApi"

export const useFreelancerProfile = ()=>{
    return useQuery({
        queryKey:['freelancerProfile'],
        queryFn:fetchFreelancerProfile,
        staleTime:1000 * 60 * 5
    })
}