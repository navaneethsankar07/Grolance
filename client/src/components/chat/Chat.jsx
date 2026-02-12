import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { X, Lock, AlertCircle } from "lucide-react"; 
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useChatRooms, useChatMessages } from "./chatQueries";
import { useChatMutations } from "./chatMutations";
import { useChatSocket } from "../../hooks/chat/UseChatRooms";
import { chatSchema } from "./chatSchema";


const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function Chat({ onClose, data }) {
  const initialRoomId = data?.initialRoomId;
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const topItemRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const lastScrollHeightRef = useRef(0);
  const lastMessageCountRef = useRef(0);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" }
  });

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  const { data: rooms, isLoading: roomsLoading } = useChatRooms();
  
  const currentRoom = useMemo(() =>{
  const roomList = Array.isArray(rooms?.results) 
    ? rooms.results 
    : Array.isArray(rooms) 
      ? rooms 
      : [];

  return roomList.find(r => r.id === selectedRoomId);
}, [rooms, selectedRoomId]);
  
  const isChatDisabled = useMemo(() => {
    if (!currentRoom) return false;
    return currentRoom.can_chat === false;
  }, [currentRoom]);

  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useChatMessages(selectedRoomId);

  const { deleteMsgMutation } = useChatMutations(selectedRoomId);

  const {
    isConnected,
    isOtherTyping,
    sendMessage,
    sendTypingStatus,
    notifyDeletion
  } = useChatSocket(isChatDisabled ? null : selectedRoomId);

  const allMessages = useMemo(() => {
    const flattened = messagePages?.pages.flatMap(page => page.results) || [];
    return [...flattened].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [messagePages]);

  const messageValue = watch("message");
  useEffect(() => {
    if (!isConnected || isChatDisabled || !messageValue) return;

    sendTypingStatus(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTypingStatus(false), 2000);
  }, [messageValue, isConnected, isChatDisabled]);

  useEffect(() => {
    if (isFetchingNextPage && scrollContainerRef.current) {
      lastScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const currentCount = allMessages.length;
    const isNewMessage = currentCount > lastMessageCountRef.current;
    lastMessageCountRef.current = currentCount;

    if (lastScrollHeightRef.current > 0) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      scrollContainerRef.current.scrollTop = newScrollHeight - lastScrollHeightRef.current;
      lastScrollHeightRef.current = 0;
    } else if (isNewMessage || isOtherTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages.length, isOtherTyping]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (initialRoomId) setSelectedRoomId(initialRoomId);
  }, [initialRoomId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (topItemRef.current) observer.observe(topItemRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, selectedRoomId]);

  
  const onValidSubmit = (formData) => {
    if (isChatDisabled) return;
    sendMessage(formData.message);
    reset(); 
    sendTypingStatus(false);
  };

  const handleDelete = (msgId) => {
    lastMessageCountRef.current = allMessages.length;
    deleteMsgMutation.mutate(msgId);
    notifyDeletion(msgId);
  };

  const filteredRooms = (rooms?.results || rooms || [])?.filter?.(room =>
    room.other_participant?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed inset-4 md:inset-10 lg:inset-x-40 lg:inset-y-10 bg-white z-[70] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-[100] transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="flex-1 flex overflow-hidden">
          <div className="hidden md:flex w-[350px] bg-white border-r border-gray-100 flex-col">
            <div className="px-6 py-6 border-b border-gray-50">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {roomsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-gray-50 animate-pulse rounded-xl" />)}
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <ConversationItem
                    key={room.id}
                    active={selectedRoomId === room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    name={room.other_participant.full_name}
                    profile_photo={room.other_participant.profile_photo}
                    message={room.last_message?.text || "No messages yet"}
                    time={formatTimeAgo(room.last_message?.created_at)}
                    unread={!room.last_message?.is_read && (room.last_message?.sender === room.other_participant.id || room.last_message?.sender_id === room.other_participant.id)}
                    isOnline={!room.can_chat ? false : isConnected && selectedRoomId === room.id}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white relative">
            {selectedRoomId ? (
              <>
                <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {currentRoom?.other_participant?.profile_photo ?
                        <img src={currentRoom?.other_participant?.profile_photo} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                        : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm">
                          {currentRoom?.other_participant?.full_name?.charAt(0)}
                        </div>
                      }
                      {isConnected && !isChatDisabled && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 leading-tight">
                        {currentRoom?.other_participant?.full_name}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-medium ${isChatDisabled ? "text-gray-400" : isConnected ? "text-green-500" : "text-amber-500"}`}>
                          {isChatDisabled ? "Archived Chat" : isConnected ? "Active Now" : "Reconnecting..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 flex flex-col bg-[#fcfdfe]">
                  <div ref={topItemRef} className="py-2 w-full flex justify-center h-8">
                    {isFetchingNextPage && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                  </div>

                  {allMessages.map((msg) => {
                    const isMe = msg.is_me === true || msg.sender === currentUserId || msg.sender_id === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                        <div className="group relative max-w-[70%]">
                          <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <div className={`text-[9px] mt-1 flex items-center gap-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && msg.is_read && <span>• Read</span>}
                            </div>
                          </div>
                          {isMe && (
                            <button onClick={() => handleDelete(msg.id)} className="absolute -left-8 top-1 p-1.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isOtherTyping && (
                    <div className="flex justify-start mb-4 animate-in slide-in-from-bottom-1 duration-200">
                      <div className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-xl rounded-tl-none text-[11px] flex items-center gap-1.5">
                        typing
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                  {isChatDisabled ? (
                    <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <div className="p-2 bg-gray-100 rounded-full mb-2">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">Messaging Disabled</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">The contract has been completed or is no longer active.</p>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto">
                      <form onSubmit={handleSubmit(onValidSubmit)} className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            {...register("message")}
                            type="text"
                            autoComplete="off"
                            placeholder="Type a message..."
                            className={`w-full py-2.5 px-5 bg-gray-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${errors.message ? "border-red-300 focus:ring-red-100" : "border-none focus:ring-blue-500"}`}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!isConnected}
                          className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md hover:bg-blue-700 disabled:bg-gray-200"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                      </form>
                      {errors.message && (
                        <div className="mt-2 flex items-center gap-1.5 text-red-500 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium">{errors.message.message}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ConversationItem({ name, profile_photo, message, time, unread, active, onClick, isOnline }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all relative ${active ? "bg-blue-50/50 border-r-4 border-blue-600" : "hover:bg-gray-50"
        }`}
    >
      <div className="relative flex-shrink-0">
        {profile_photo ? <img src={profile_photo} className="w-11 h-11 rounded-xl object-cover shadow-sm" alt="" /> :
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {name.charAt(0)}
          </div>
        }
        {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className={`font-bold text-sm truncate ${active ? "text-blue-900" : "text-gray-900"}`}>{name}</h3>
          <span className="text-gray-400 text-[9px] uppercase">{time}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className={`text-xs truncate ${unread ? "text-gray-900 font-bold" : "text-gray-500"}`}>{message}</p>
          {unread && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />}
        </div>
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#fafbfc]">
      <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9 1.1L21 3z" /></svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Conversation</h2>
      <p className="text-sm text-gray-500 max-w-xs">Pick a chat from the sidebar to start messaging.</p>
    </div>
  );
}