import { useQuery } from "@tanstack/react-query";
import { fetchAdminFAQs } from "./faqApi";

export const useAdminFAQs = (page) => {
    return useQuery({
        queryKey: ["admin-faqs", page],
        queryFn: () => fetchAdminFAQs(page),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
};