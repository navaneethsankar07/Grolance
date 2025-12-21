import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./userManagementApi";

export const useAdminUsers = ({ page, search }) => {
  return useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () => fetchUsers({ page, search }),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
