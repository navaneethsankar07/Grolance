import { useQuery } from "@tanstack/react-query"
import { fetchRecommendedProjects, fetchTodos } from "./DashboardApi"

export const useRecommendedProjects = () =>{
    return useQuery({
        queryKey:['recommended-projects'],
        queryFn:fetchRecommendedProjects,
    })
}

export const useTodos = () => {
    return useQuery({
        queryKey:['todos'],
        queryFn:fetchTodos,
        staleTime:5 * 60 * 1000
    });
};