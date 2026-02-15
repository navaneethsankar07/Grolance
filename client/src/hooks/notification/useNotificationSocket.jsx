import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

const notificationSound = new Audio('/notification-pop.mp3');

export const useNotificationSocket = (userId) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const currentRole = useSelector((state) => state.auth.user?.current_role);

  useEffect(() => {
    if (!userId || !accessToken) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${accessToken}`);

    socket.onmessage = (event) => {
      const newNotif = JSON.parse(event.data);
      
      const isCorrectRole = newNotif.target_role === currentRole;

      if (isCorrectRole) {
        notificationSound.currentTime = 0; 
        notificationSound.play().catch(err => {
        });
      }

      queryClient.setQueryData(["notifications", false], (oldData) => {
        if (!isCorrectRole) return oldData; 
        
        if (!oldData) return { results: [newNotif] };
        return {
          ...oldData,
          results: [newNotif, ...oldData.results]
        };
      });

      queryClient.invalidateQueries(["notifications"]);
    };

    
    return () => socket.close();
  }, [userId, accessToken, queryClient, currentRole]);
};