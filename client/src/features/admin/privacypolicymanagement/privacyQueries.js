import { useQuery } from "@tanstack/react-query";
import { fetchprivacypolicies } from "./privacyApi";

export const usePrivacyPolicy = (page) => {
  return useQuery({
    queryKey: ["privacypolicy", page],
    queryFn: () => fetchprivacypolicies({ page }),
    keepPreviousData: true,
  });
};