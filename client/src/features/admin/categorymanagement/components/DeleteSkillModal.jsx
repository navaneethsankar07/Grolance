import React from 'react';
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
    deleteSkillMutation.reset();
    onOpenChange(false);
  };

  const errorMessage = deleteSkillMutation.error?.response?.data?.[0] || 
                       deleteSkillMutation.error?.response?.data?.detail ||
                       "An error occurred while deleting.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[448px] bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="text-[17px] font-semibold text-slate-800">Delete Skill</h2>
          <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="px-8 pb-8">
          {deleteSkillMutation.isError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600 font-medium text-center">
                {errorMessage}
              </p>
            </div>
          )}

          <p className="text-xs text-slate-600 mb-4">
            Are you sure you want to delete this skill?
          </p>

          <div className="bg-slate-50 rounded-lg px-4 py-4 mb-6">
            <p className="text-sm font-medium text-slate-800">{skill.name}</p>
          </div>

          <p className="text-xs text-slate-500 mb-8">
            This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 h-12 bg-slate-100 rounded-lg font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteSkillMutation.isPending}
              className="flex-1 h-12 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium text-sm"
            >
              {deleteSkillMutation.isPending ? "Deleting..." : "Delete Skill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}