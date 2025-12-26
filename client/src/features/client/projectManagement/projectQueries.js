import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchMyProjects, fetchProjectById, fetchSkills} from './ProjectApi';

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  });
};


export const useMyProjects = ({page,status, search}) =>{
  return useQuery({
    queryKey:['my-projects',{page,status,search}],
    queryFn: fetchMyProjects,
    keepPreviousData:true,
  })
}
export const useProjectDetails = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });
};