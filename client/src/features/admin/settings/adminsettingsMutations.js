import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGlobalSettings } from './adminSettingsApi';
import { toast } from 'react-toastify'; 
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGlobalSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['globalSettings'], data);
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update settings';
      toast.error(message);
    }
  });
};