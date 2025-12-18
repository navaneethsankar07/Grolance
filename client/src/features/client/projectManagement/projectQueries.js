import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchSkills} from './ProjectApi';

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  });
};
