import { Loader2 } from "lucide-react";
import { useDeleteProject } from "../projectMutations";

export default function ProjectDeleteModal({ projectId, onClose }) {
  const { mutateAsync:deleteProject, isPending } = useDeleteProject();
  console.log(projectId);
  
const handleDelete = async () => {
  await deleteProject({ id: projectId });
  onClose();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Delete Project
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Are you sure you want to delete this project?  
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
