import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill,deleteSkill,updateSkill } from "./categoryApi";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-skills"]);
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-skills"]);
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-skills"]);
    },
  });
};
