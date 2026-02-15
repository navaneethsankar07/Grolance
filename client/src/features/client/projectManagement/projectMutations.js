import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, updateProject } from "./ProjectApi";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
};

export const useDeleteProject = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:deleteProject,
    onSuccess:(_,projectId)=>{
      queryClient.invalidateQueries({queryKey:['my-projects']})
      queryClient.removeQueries({queryKey:['project',projectId]})
    }
  
  })
}