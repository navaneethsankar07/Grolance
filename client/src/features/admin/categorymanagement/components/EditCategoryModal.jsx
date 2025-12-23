import * as Dialog from "@radix-ui/react-dialog";
import { useUpdateCategory } from "../categoryMutations";
import { useEffect, useState } from "react";

export function EditCategoryModal({ open, onOpenChange, category }) {
  const [name, setName] = useState("");
  const updateMutation = useUpdateCategory();

useEffect(() => {
    if (open && category) {
      setName(category.name);
    }
  }, [open, category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateMutation.mutate(
      { id: category.id,
        data:{name}},
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  if (!category) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8">
          <h2 className="text-lg font-semibold mb-4">Edit Category</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 border rounded-lg"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-12 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
