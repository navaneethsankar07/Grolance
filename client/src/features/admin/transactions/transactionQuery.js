import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "./transactionsApi"

export const usePlatformTransactions = (page, status) => {
    return useQuery({
        queryKey: ['platform-transactions', page, status],
        queryFn: () => fetchTransactions(page, status),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    })
}