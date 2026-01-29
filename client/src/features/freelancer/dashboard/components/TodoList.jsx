import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

function TodoList() {
  const [tasks, setTasks] = useState([
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Removed the ': number' type for JSX compatibility
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-[#F3F4F6] p-6 shadow-sm h-full">
      <h2 className="text-[22px] font-bold text-[#111827] leading-7 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        Personal Tasks
      </h2>

      {/* Input Area */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 h-[42px] px-4 border border-[#E5E7EB] rounded-lg text-sm outline-none focus:border-[#3B82F6] transition-all"
        />
        <button
          onClick={addTask}
          className="bg-[#3B82F6] text-white px-4 h-[42px] rounded-lg flex items-center gap-2 hover:bg-[#2563EB] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Add</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#F3F4F6] transition-all"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-5 h-5 rounded accent-[#3B82F6] cursor-pointer"
            />
            <span className={`flex-1 text-sm transition-all ${
              task.completed ? 'text-[#9CA3AF] line-through' : 'text-[#374151] font-medium'
            }`}>
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-md transition-all text-[#9CA3AF]"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm italic">No tasks for today!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;