import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "./ProjectApi";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      // refresh project listing later
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};