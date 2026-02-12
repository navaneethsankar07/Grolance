import { useQuery } from "@tanstack/react-query"
import { fetchRecommendedFreelancers } from "./homePageApi"

export const useRecommendedFreelancers = () => {
    return useQuery({
        queryKey:['recommended-freelancers'],
        queryFn:fetchRecommendedFreelancers,
        staleTime:5 * 60 * 1000,
    });
};