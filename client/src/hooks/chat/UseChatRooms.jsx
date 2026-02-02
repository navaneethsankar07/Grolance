import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useChatSocket = (roomId) => {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const queryClient = useQueryClient();
  
  const token = useSelector(state=>state.auth.accessToken)
  useEffect(() => {
    if (!roomId || !token) return;

    // Change to your production URL as needed
    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket Connected ✅");
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "chat_message":
          // Update the Infinite Query cache with the new message
          queryClient.setQueryData(["messages", roomId], (oldData) => {
            if (!oldData) return oldData;
            const newPages = [...oldData.pages];
            // Add the new message to the first page (latest results)
            newPages[0] = {
              ...newPages[0],
              results: [data.message, ...newPages[0].results],
            };
            return { ...oldData, pages: newPages };
          });
          // Also update the Chat Rooms list to show the new last_message
          queryClient.invalidateQueries(["chatRooms"]);
          break;

        case "typing":
          setIsOtherTyping(data.is_typing);
          break;

        case "delete":
          // Real-time removal of message for the other user
          queryClient.setQueryData(["messages", roomId], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                results: page.results.filter((m) => m.id !== data.message_id),
              })),
            };
          });
          break;

        default:
          break;
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket Disconnected ❌");
      setIsConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [roomId, queryClient]);

  // Methods to interact with the socket
  const sendMessage = (text) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: "chat_message", 
        message: text 
      }));
    }
  };

  const sendTypingStatus = (status) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: "typing", 
        is_typing: status 
      }));
    }
  };

  const notifyDeletion = (messageId) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: "delete_message", 
        message_id: messageId 
      }));
    }
  };

  return { isConnected, isOtherTyping, sendMessage, sendTypingStatus, notifyDeletion };
};