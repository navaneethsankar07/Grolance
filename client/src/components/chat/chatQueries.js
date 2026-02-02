import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchChatRooms, fetchMessages } from "./chatApi";

export const useChatRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    refetchOnWindowFocus: false,
  });
};

export const useChatMessages = (roomId) => {
  return useInfiniteQuery({
    queryKey: ["messages", roomId],
    queryFn: ({ pageParam }) => fetchMessages({ roomId, pageParam }),
    enabled: !!roomId,
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        return url.searchParams.get("page");
      } catch (e) {
        return undefined;
      }
    },
  });
};