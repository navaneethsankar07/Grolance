import axiosInstance from '../../../api/axiosInstance'
export const fetchTransactions = async (page = 1, status = "") => {
    const response = await axiosInstance.get('/payments/platform-transactions/', {
        params: { page, status }
    })
    return response.data;
}