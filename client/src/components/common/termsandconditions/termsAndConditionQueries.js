import { useQuery } from "@tanstack/react-query"
import { fetchTermsAndConditions } from "./termsAndConditionsApi"

export const useTermsAndConditions = ()=>{
    return useQuery({
        queryKey:['terms-and-conditions'],
        queryFn:fetchTermsAndConditions,
        staleTime:1000 * 60 *5
    })
}