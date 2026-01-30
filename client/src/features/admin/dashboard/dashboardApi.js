import axiosInstance from "../../../api/axiosInstance"

export const fetchDashboardStats = async () => {
    const {data} = await axiosInstance.get('/admin/dashboard-stats/');
    return data;
}