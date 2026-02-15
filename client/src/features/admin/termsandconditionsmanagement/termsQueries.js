import { useQuery } from "@tanstack/react-query";
import { fetchTermsSections } from "./termsApi";

export const useTermsSections = (page) => {
  return useQuery({
    queryKey: ["termsSections", page],
    queryFn: () => fetchTermsSections({ page }),
    keepPreviousData: true,
  });
};