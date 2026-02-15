import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, completeTodo} from './DashboardApi'
import { toast } from "react-toastify";

export const useTodoMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            toast.success("Task added successfully");
        },
        onError: (error) => {
            const message = error.response?.data?.detail || "Failed to add task";
            toast.error(message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            toast.success("Task deleted");
        },
        onError: () => toast.error("Could not delete task")
    });

    const completeMutation = useMutation({
        mutationFn: completeTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        onError: () => toast.error("Failed to update status")
    });

    return {
        createTodo: createMutation.mutate,
        isCreating: createMutation.isPending,
        deleteTodo: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        completeTodo: completeMutation.mutate,
        isCompleting: completeMutation.isPending
    };
};