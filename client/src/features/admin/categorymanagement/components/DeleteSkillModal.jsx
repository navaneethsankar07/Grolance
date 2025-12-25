import { useDeleteSkill } from "../skillMutations";

export default function DeleteSkillModal({ open, onOpenChange, skill }) {
  const deleteSkillMutation = useDeleteSkill();

  if (!open || !skill) return null;

  const handleDelete = () => {
    deleteSkillMutation.mutate(skill.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[448px] bg-white rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="text-[17px] font-semibold text-slate-800">
            Delete Skill
          </h2>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <p className="text-xs text-slate-600 mb-4">
            Are you sure you want to delete this skill?
          </p>

          <div className="bg-slate-50 rounded-lg px-4 py-4 mb-6">
            <p className="text-sm font-medium text-slate-800">
              {skill.name}
            </p>
          </div>

          <p className="text-xs text-slate-500 mb-8">
            This action cannot be undone. The skill will be permanently removed.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 h-12 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteSkillMutation.isPending}
              className="flex-1 h-12 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {deleteSkillMutation.isPending ? "Deleting..." : "Delete Skill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}