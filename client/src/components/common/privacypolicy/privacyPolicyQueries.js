
import { useQuery } from "@tanstack/react-query"
import { fetchPrivacyPolicies } from "./privacyPolicyApi"

export const usePrivacyPolicies = ()=>{
    return useQuery({
        queryKey:['privacy-policies'],
        queryFn:fetchPrivacyPolicies,
        staleTime:1000 * 60 *5
    })
}