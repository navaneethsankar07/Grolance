import {useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketReply } from "./supportApi";
import { toast } from "react-toastify";

export const useReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTicketReply,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["supportTickets"]);
      queryClient.invalidateQueries(["ticket", data.id]);
      toast.success("Reply sent and email triggered successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send reply");
    },
  });
};