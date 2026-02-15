import { useQuery } from "@tanstack/react-query";
import { fetchSupportTickets, fetchTicketDetails } from "./supportApi";

export const useSupportTickets = (page, status) => {
  return useQuery({
    queryKey: ["supportTickets", { page, status }],
    queryFn: () => fetchSupportTickets(page, status),
    keepPreviousData: true,
  });
};

export const useTicketDetails = (id) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicketDetails(id),
    enabled: !!id,
  });
};

