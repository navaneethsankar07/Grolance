import React from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { useTodos } from '../dashboardQueries';
import { useTodoMutations } from '../dashboardMutations';

function TodoList() {
  const { data: tasksData, isLoading } = useTodos();
  const { createTodo, deleteTodo, completeTodo, isCreating } = useTodoMutations();
  
  const tasks = tasksData?.results || [];
  const totalCount = tasksData?.count || 0;
  const isLimitReached = totalCount >= 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      todo: ""
    }
  });

  const onSubmit = (data) => {
    if (!isCreating && !isLimitReached) {
      createTodo({ todo: data.todo }, {
        onSuccess: () => reset()
      });
    }
  };

  if (isLoading) return (
    <div className="bg-white rounded-xl border border-[#F3F4F6] p-6 shadow-sm h-full flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-[#F3F4F6] p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold text-[#111827] leading-7" style={{ fontFamily: 'Inter, sans-serif' }}>
          Personal Tasks
        </h2>
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${isLimitReached ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          {totalCount}/10 Slots
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              {...register("todo", { 
                required: "Task is required",
                maxLength: { value: 60, message: "Limit 60 characters" }
              })}
              placeholder={isLimitReached ? "Limit reached (10/10)" : "Add a new task..."}
              disabled={isLimitReached || isCreating}
              className={`w-full h-[42px] px-4 border ${errors.todo ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-lg text-sm outline-none focus:border-[#3B82F6] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
          <button
            type="submit"
            disabled={isLimitReached || isCreating}
            className="bg-[#3B82F6] text-white px-4 h-[42px] rounded-lg flex items-center gap-2 hover:bg-[#2563EB] transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span className="text-sm font-semibold hidden sm:inline">Add</span>
          </button>
        </div>
        {errors.todo && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.todo.message}</p>}
      </form>

      <div className="flex flex-col gap-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="group flex items-center gap-3 p-3 rounded-lg bg-transparent md:hover:bg-[#F9FAFB] border border-transparent md:hover:border-[#F3F4F6] transition-all"
            >
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => completeTodo(task.id)}
                className="w-5 h-5 rounded accent-[#3B82F6] cursor-pointer flex-shrink-0"
              />
              <span className={`flex-1 text-sm transition-all break-words min-w-0 ${
                task.is_completed ? 'text-[#9CA3AF] line-through' : 'text-[#374151] font-medium'
              }`}>
                {task.todo}
              </span>
              <button
                type="button"
                onClick={() => deleteTodo(task.id)}
                className="p-2 md:p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-md transition-all text-[#9CA3AF] flex-shrink-0"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4 md:w-4 md:h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm italic">No tasks for today!</p>
          </div>
        )}
      </div>

      {isLimitReached && (
        <p className="mt-4 text-[11px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
          Task limit reached. Delete a task to add a new one.
        </p>
      )}
    </div>
  );
}

export default TodoList;