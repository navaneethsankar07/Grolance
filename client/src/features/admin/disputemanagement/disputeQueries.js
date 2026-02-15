import { useQuery } from "@tanstack/react-query";
import { fetchAdminDisputes, fetchAdminDisputeDetail } from "./disputeApi";

export const useAdminDisputes = () => {
  return useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: fetchAdminDisputes,
  });
};

export const useAdminDisputeDetail = (id) => {
  return useQuery({
    queryKey: ["admin", "disputes", id],
    queryFn: () => fetchAdminDisputeDetail(id),
    enabled: !!id,
  });
};