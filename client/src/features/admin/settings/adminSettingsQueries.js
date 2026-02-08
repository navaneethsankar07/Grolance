import { useQuery } from '@tanstack/react-query';
import { fetchGlobalSettings } from './adminSettingsApi';

export const useGlobalSettings = () => {
  return useQuery({
    queryKey: ['globalSettings'],
    queryFn: fetchGlobalSettings,
    staleTime: 1000 * 60 * 5,
  });
};