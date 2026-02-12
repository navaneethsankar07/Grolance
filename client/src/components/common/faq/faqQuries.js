import { useQuery } from "@tanstack/react-query";
import { fetchPublicFAQs } from "./faqApi";

export const useFAQs = (category, page) => {
  return useQuery({
    queryKey: ["public-faqs", category, page],
    queryFn: () => fetchPublicFAQs(category, page),
    staleTime: 1000 * 60 * 10,
    keepPreviousData: true,
  });
};
