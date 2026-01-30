import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "./dashboardApi"

export const useDashboardStats = ()=>{
    return useQuery({
        queryKey:['admin-dashboard-stats'],
        queryFn:fetchDashboardStats,
        staleTime:1000 * 60 * 5
    });
};