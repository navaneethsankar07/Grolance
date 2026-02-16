import { useEffect, useState } from "react";
import { useUpdateSkill } from "../skillMutations";
import { toast } from "react-toastify";

export default function EditSkillModal({ open, onOpenChange, skill, categories }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  console.log(categories.data);
  

  const updateSkillMutation = useUpdateSkill();

  useEffect(() => {
    if (open && skill) {
      setName(skill.name);
      setCategoryId(skill.category);
    }
  }, [open, skill]);

  if (!open || !skill) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    updateSkillMutation.mutate(
      {
        id: skill.id,
        data: {
          name,
          category: categoryId,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
    toast.success("skill updated")
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[448px] bg-white rounded-xl shadow-2xl">
        
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="text-[17px] font-semibold text-slate-800">
            Edit Skill
          </h2>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="px-8 pb-8">
          <p className="text-xs text-slate-600 mb-8">
            Update the skill details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Skill Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[50px] px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories?.data.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-12 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateSkillMutation.isPending}
                className="flex-1 h-12 bg-blue-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
