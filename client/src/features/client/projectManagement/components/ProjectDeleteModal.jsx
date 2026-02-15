import { Loader2, AlertTriangle } from "lucide-react";
import { useDeleteProject } from "../projectMutations";

export default function ProjectDeleteModal({ projectId, onClose }) {
  const { mutateAsync: deleteProject, isPending } = useDeleteProject();

  const handleDelete = async () => {
    try {
      await deleteProject({ id: projectId });
      onClose();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Delete Project
            </h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to delete this project? This action is permanent and <span className="font-semibold text-red-600">cannot be undone</span>.
          </p>

          <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-red-200"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {isPending ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}