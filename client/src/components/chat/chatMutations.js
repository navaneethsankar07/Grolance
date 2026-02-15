import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage, getOrCreateRoom } from "./chatApi";

export const useChatMutations = (roomId) => {
  const queryClient = useQueryClient();

  const deleteMsgMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(["messages", roomId], (oldData) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            results: page.results.filter(msg => msg.id !== messageId)
          }))
        };
      });
    },
  });

  return { deleteMsgMutation };
};

export const useChatActions = () => {
  const queryClient = useQueryClient();

  const getRoomMutation = useMutation({
    mutationFn: getOrCreateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(["chatRooms"]);
    },
  });

  return { getRoomMutation };
};