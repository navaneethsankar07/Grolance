// features/admin/categories/categoryMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      axiosInstance.post("/categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.patch(`/categories/${id}/`, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      axiosInstance.delete(`/categories/${id}/`),

    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
    },
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      axiosInstance.post("/categories/skills/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-skills"]);
    },
  });
};