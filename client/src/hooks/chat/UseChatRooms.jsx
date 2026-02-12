import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useChatSocket = (roomId) => {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const queryClient = useQueryClient();
  const token = useSelector(state => state.auth.accessToken);

  useEffect(() => {
    console.log(`%c [useChatSocket] connecting to room: ${roomId}`, 'color: #3b82f6; font-weight: bold;');
    console.trace("Socket Connection Trace");
    if (!roomId || !token) return;

    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "chat_message":
          queryClient.setQueryData(["messages", roomId], (oldData) => {
            if (!oldData) return oldData;
            const newPages = [...oldData.pages];
            newPages[0] = {
              ...newPages[0],
              results: [data.message, ...newPages[0].results],
            };
            return { ...oldData, pages: newPages };
          });
          queryClient.invalidateQueries(["chatRooms"]);
          break;

        case "typing":
          setIsOtherTyping(data.is_typing);
          break;

        case "delete":
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

        case "read_receipt":
          queryClient.setQueryData(["messages", roomId], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                results: page.results.map((m) =>
                  m.id === data.message_id ? { ...m, is_read: true } : m
                ),
              })),
            };
          });
          break;

        case "all_read_update":
          queryClient.setQueryData(["messages", roomId], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                results: page.results.map((m) => ({ ...m, is_read: true })),
              })),
            };
          });
          queryClient.invalidateQueries(["chatRooms"]);
          break;

        default:
          break;
      }
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [roomId, queryClient, token]);

  const sendMessage = (text) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "chat_message", message: text }));
    }
  };

  const sendTypingStatus = (status) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "typing", is_typing: status }));
    }
  };

  const notifyDeletion = (messageId) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "delete_message", message_id: messageId }));
    }
  };

  return { isConnected, isOtherTyping, sendMessage, sendTypingStatus, notifyDeletion };
};