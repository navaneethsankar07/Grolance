import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvitationStatus } from './invitationApi';
import { toast } from 'react-toastify';

export const useUpdateInvitationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInvitationStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['received-invitations'] });
      
      const statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1);
      toast.success(`Invitation ${statusText} successfully!`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || "Failed to update invitation";
      toast.error(errorMessage);
    }
  });
};