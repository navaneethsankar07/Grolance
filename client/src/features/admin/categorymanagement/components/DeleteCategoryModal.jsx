import * as Dialog from "@radix-ui/react-dialog";
import { useDeleteCategory } from "../categoryMutations";

export function DeleteCategoryModal({ open, onOpenChange, category }) {
  const deleteMutation = useDeleteCategory();

  const handleDelete = () => {
    deleteMutation.mutate(category.id, {
      onSuccess: () => onOpenChange(false),
      onError: (error) => {
        const serverMessage = error.response?.data?.[0] || 
                            error.response?.data?.detail || 
                            "An error occurred";
      
      alert(serverMessage);
      }
    });
  };

  if (!category) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8">
          <h2 className="text-lg font-semibold mb-4">Delete Category</h2>

          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <b>{category.name}</b>?
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 h-12 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
