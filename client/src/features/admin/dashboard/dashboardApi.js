import axiosInstance from "../../../api/axiosInstance"

export const fetchDashboardStats = async () => {
    const {data} = await axiosInstance.get('/admin/dashboard-stats/');
    return data;
}

export const fetchRevenueChart = async (range) => {
    const {data} = await axiosInstance.get(`/admin/revenue-chart/?range=${range}`)
    return data;
}

export const fetchProposalsChart = async () =>{
    const {data} = await axiosInstance.get('/admin/proposals-chart')
    return data;
}