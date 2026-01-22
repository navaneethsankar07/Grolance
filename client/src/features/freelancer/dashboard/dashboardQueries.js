import { useQuery } from "@tanstack/react-query"
import { fetchRecommendedProjects } from "./DashboardApi"

export const useRecommendedProjects = () =>{
    return useQuery({
        queryKey:['recommended-projects'],
        queryFn:fetchRecommendedProjects,
    })
}