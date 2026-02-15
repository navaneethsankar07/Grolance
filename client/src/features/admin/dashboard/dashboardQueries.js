import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats, fetchProposalsChart, fetchRevenueChart } from "./dashboardApi"

export const useDashboardStats = ()=>{
    return useQuery({
        queryKey:['admin-dashboard-stats'],
        queryFn:fetchDashboardStats,
        staleTime:1000 * 60 * 5
    });
};

export const useRevenueChart = (range) => {
    return useQuery({
        queryKey:['admin-revenue-chart',range],
        queryFn: ()=>fetchRevenueChart(range),
        staleTime:1000 * 60 * 5
    })
}

export const useProposalsChart = () => {
    return useQuery({
        queryKey:['admin-proposals-chart'],
        queryFn:fetchProposalsChart,
        staleTime:1000 * 60 * 5
    })
}