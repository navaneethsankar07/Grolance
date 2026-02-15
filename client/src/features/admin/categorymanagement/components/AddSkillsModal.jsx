import { useState } from "react";
import { useCreateSkill } from "../skillMutations";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function AddSkillModal({ categories, isLoading, onClose }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const createSkillMutation = useCreateSkill();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !categoryId) {
        toast.error("Please fill all fields");
        return;
    }

    createSkillMutation.mutate(
      {
        name,
        category: categoryId,
      },
      {
        onSuccess: () => {
          toast.success("Skill created successfully");
          setName("");
          setCategoryId("");
          onClose();
        },
        onError: () => {
          toast.error("Failed to create skill");
        }
      }
    );
  };

  const handleCancel = () => {
    setName("");
    setCategoryId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[448px] bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="text-[17px] font-semibold text-slate-800">Add Skill</h2>
          <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="px-8 pb-8">
          <p className="text-xs text-slate-600 mb-8">Add a new skill to your freelancing platform.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Skill Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React"
                className="w-full h-[50px] px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Category</label>
              <select
                disabled={isLoading}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              >
                {isLoading ? (
                  <option>Loading categories...</option>
                ) : (
                  <>
                    <option value="">Select category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-12 bg-slate-100 rounded-lg font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createSkillMutation.isPending || isLoading}
                className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {createSkillMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Skill"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}