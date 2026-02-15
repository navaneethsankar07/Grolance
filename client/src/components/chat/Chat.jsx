import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { X, Lock, AlertCircle, ArrowLeft } from "lucide-react";
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
  const [showChatMobile, setShowChatMobile] = useState(!!initialRoomId);

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

  const currentRoom = useMemo(() => {
    const roomList = Array.isArray(rooms?.results) ? rooms.results : Array.isArray(rooms) ? rooms : [];
    return roomList.find(r => r.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

  const isChatDisabled = useMemo(() => {
    if (!currentRoom) return false;
    return currentRoom.can_chat === false;
  }, [currentRoom]);

  const { data: messagePages, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(selectedRoomId);
  const { deleteMsgMutation } = useChatMutations(selectedRoomId);
  const { isConnected, isOtherTyping, sendMessage, sendTypingStatus, notifyDeletion } = useChatSocket(isChatDisabled ? null : selectedRoomId);

  const allMessages = useMemo(() => {
    const flattened = messagePages?.pages.flatMap(page => page.results) || [];
    return [...flattened].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [messagePages]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (topItemRef.current) {
      observer.observe(topItemRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    setShowChatMobile(true);
  };

  const handleBackToList = () => {
    setShowChatMobile(false);
  };

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
      <div className="fixed inset-0 md:inset-10 lg:inset-x-40 lg:inset-y-10 bg-white z-[70] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex-1 flex overflow-hidden h-full">
          <div className={`${showChatMobile ? 'hidden' : 'flex'} w-full md:flex md:w-[350px] bg-white border-r border-gray-100 flex-col h-full`}>
            <div className="px-6 py-6 border-b border-gray-50 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full md:hidden">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto mt-2">
              {roomsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-gray-50 animate-pulse rounded-xl" />)}
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <ConversationItem
                    key={room.id}
                    active={selectedRoomId === room.id}
                    onClick={() => handleRoomSelect(room.id)}
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

          <div className={`${!showChatMobile ? 'hidden' : 'flex'} flex-1 md:flex flex-col bg-white relative h-full`}>
            {selectedRoomId ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-3">
                    <button onClick={handleBackToList} className="p-2 -ml-2 hover:bg-gray-100 rounded-full md:hidden">
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="relative">
                      {currentRoom?.other_participant?.profile_photo ?
                        <img src={currentRoom?.other_participant?.profile_photo} className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shadow-sm" alt="" />
                        : <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm text-sm">
                          {currentRoom?.other_participant?.full_name?.charAt(0)}
                        </div>
                      }
                      {isConnected && !isChatDisabled && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 leading-tight truncate max-w-[150px] md:max-w-none">
                        {currentRoom?.other_participant?.full_name}
                      </h2>
                      <span className={`text-[10px] font-medium ${isChatDisabled ? "text-gray-400" : isConnected ? "text-green-500" : "text-amber-500"}`}>
                        {isChatDisabled ? "Archived" : isConnected ? "Active Now" : "Connecting..."}
                      </span>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full hidden md:block">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col bg-[#fcfdfe]">
                  <div ref={topItemRef} className="py-2 w-full flex justify-center h-8">
                    {isFetchingNextPage && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                  </div>

                  {allMessages.map((msg) => {
                    const isMe = msg.is_me === true || msg.sender === currentUserId || msg.sender_id === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                        <div className="group relative max-w-[85%] md:max-w-[70%]">
                          <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <div className={`text-[9px] mt-1 flex items-center gap-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && msg.is_read && <span>• Read</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {isOtherTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-xl rounded-tl-none text-[11px] flex items-center gap-1.5">
                        typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>

                <div className="p-3 md:p-4 bg-white border-t border-gray-100">
                  {isChatDisabled ? (
                    <div className="text-center p-2">
                      <p className="text-[11px] text-gray-500">Messaging disabled for this contract.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onValidSubmit)} className="flex items-center gap-2 max-w-4xl mx-auto">
                      <input
                        {...register("message")}
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 py-2.5 px-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                      <button type="submit" disabled={!isConnected} className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md hover:bg-blue-700 disabled:bg-gray-200">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <EmptyState onClose={onClose} />
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
      className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all relative ${active ? "bg-blue-50 md:border-r-4 md:border-blue-600" : "hover:bg-gray-50"}`}
    >
      <div className="relative flex-shrink-0">
        {profile_photo ? <img src={profile_photo} className="w-12 h-12 rounded-full md:rounded-xl object-cover" alt="" /> :
          <div className="w-12 h-12 rounded-full md:rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
        }
        {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="font-bold text-sm truncate text-gray-900">{name}</h3>
          <span className="text-gray-400 text-[10px]">{time}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className={`text-xs truncate ${unread ? "text-gray-900 font-bold" : "text-gray-500"}`}>{message}</p>
          {unread && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />}
        </div>
      </div>
    </button>
  );
}

function EmptyState({ onClose }) {
  return (
    <div className="flex-1 flex flex-col relative h-full">
      <div className="absolute top-4 right-4 hidden md:block z-20">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#fafbfc]">
        <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9 1.1L21 3z" /></svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Select a message</h2>
        <p className="text-xs text-gray-500 mt-1">Choose a conversation to start chatting.</p>
      </div>
    </div>
  );
}