import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchChatRooms, fetchMessages } from "./chatApi";
import { useSelector } from "react-redux"; // Import this

export const useChatRooms = (options = {}) => {
  const user = useSelector((state) => state.auth.user);

  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    enabled: !!user && (options.enabled !== false), 
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,   
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
      if (!lastPage || !lastPage.results) return undefined;

      if (!lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        return url.searchParams.get("page");
      } catch (e) {
        return undefined;
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};