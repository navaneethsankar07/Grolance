import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./userManagementApi";

export const useAdminUsers = ({ page, search ,status}) => {
  return useQuery({
    queryKey: ["admin-users", page, search,status],
    queryFn: () => fetchUsers({ page, search,status }),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
